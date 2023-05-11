import type { TextDocument } from 'vscode-languageserver-textdocument'
import {
  Connection,
  InitializeParams,
  TextDocuments,
  ShowMessageParams,
  MessageType,
  WorkDoneProgressReporter
} from 'vscode-languageserver'
import {
  ClientOpts,
  CurrentTimestamp,
  ImagesKeys,
  InitializeCapabilities,
  type InitializeReturn,
  type InitializedReturn,
  type LanguageData,
  type StatusType
} from '../config'
import { Client, type SetActivity } from '@xhayper/discord-rpc'
import { Logger } from './logger'
import { basename, extname } from 'node:path'
import * as axios from 'axios'
import * as Languages from '../langs/languages.json'

/**
 * Server class that handles event logic and rich presence-related functions
 * - [@xhayper/discord-rpc](https://github.com/xhayper/discord-rpc)
 */
export class Server {
  private logger = new Logger(this.connection)
  private client = new Client(ClientOpts)
  private workReporter: WorkDoneProgressReporter
  private workspaceName: string

  /**
   * Sets up a new server instance.
   * @param {Connection} connection - `vscode-languageserver` Connection
   * @example
   * ```js
   * new Server(connection)
   * ```
   */
  constructor(protected connection: Connection) {}

  /**
   * Event corresponding to `onInitialize`
   * @param {InitializeParams} params
   */
  public onInitialize(params?: InitializeParams): InitializeReturn {
    this.logger.log('Initializating server')
    this.workspaceName = basename(params?.workspaceFolders[0].name ?? 'Not in a workspace!')
    return InitializeCapabilities
  }

  /**
   * Event corresponding to `onInitialized`
   */
  public async onInitialized(documents: TextDocuments<TextDocument>): Promise<InitializedReturn> {
    this.workReporter = await this.connection.window.createWorkDoneProgress()
    this.workReporter.begin('Discord Presence', 50, 'Connecting...')
    this.logger.log('Server initialized')

    await this.fetchVersion()

    this.client.on('connected', () => {
      this.logger.log(`Client logged (${this.client.user?.tag} has been hacked)`)
      this.workReporter.report(100, this.client.user?.tag)
      this.updateActivity('idle')

      documents.onDidChangeContent((x) => this.updateActivity('editing', x.document))
      documents.onWillSave((x) => this.onWillSave(x.document))
    })

    await this.client.login()
    return
  }

  /**
   * Event corresponding to `onDidChangeContent`
   * @param {TextDocument} document
   */
  public onDidChangeContent(document: TextDocument) {
    this.updateActivity('editing', document)
  }

  /**
   * Event corresponding to `onWillSave`
   * @param {TextDocument} document
   */
  public onWillSave(document: TextDocument) {
    this.updateActivity('editing', document)
  }

  /**
   * Event corresponding to `onError`
   * @param {unknown} error
   */
  public onError(error: unknown) {
    this.logger.error(`${error}`)
    this.workReporter.report(0, 'Error')
    this.sendNotification(1, `${error}`)
  }

  /**
   * Method for update rich presence
   * @param {StatusType} status - User status
   * @param {TextDocument} document - Text document
   * @example
   * ```js
   * updateActivity('idle')
   * ```
   */
  private updateActivity(status: StatusType, document?: TextDocument) {
    let languageData: LanguageData
    let fileName: string

    if (status === 'editing' && !document) return

    if (status === 'editing') {
      fileName = this.getFileName(document)
      languageData = this.getLanguage(fileName)
    }

    const Activity: SetActivity = {
      state: status === 'editing' ? `Editing ${this.truncateString(fileName)}` : 'Idling',
      largeImageKey: status === 'editing' ? languageData.LanguageAsset : ImagesKeys.KEYBOARD,
      smallImageKey: status === 'editing' ? ImagesKeys.LOGO : ImagesKeys.IDLE,
      smallImageText: status === 'editing' ? 'Lapce' : 'Idling',
      startTimestamp: CurrentTimestamp
    }

    if (status === 'editing') {
      Activity.details = `In ${this.truncateString(this.workspaceName)}`
      Activity.largeImageText = `Editing a ${languageData.LanguageID.toUpperCase()} file`
    }

    return this.client.user.setActivity(Activity)
  }

  /**
   * Slice a string
   * @param {string} ctx - String to slice
   * @example
   * ```js
   * truncateString('a'.repeat(80)) // output: aaa...
   * ```
   */
  private truncateString(ctx: string) {
    return ctx.length >= 50 ? `${ctx.slice(0, 50)}...` : ctx
  }

  /**
   *
   */
  public sendNotification(type: MessageType, message: string) {
    this.connection.sendNotification('window/showMessage', {
      message,
      type
    } as ShowMessageParams)
  }

  /**
   * Get converted file's name
   * @param {TextDocument} document - Text Document
   * @example
   * ```js
   * getFileName(x.document) // output: file.py
   * ```
   */
  private getFileName(document: TextDocument) {
    return decodeURIComponent(basename(document.uri))
  }

  /**
   * Fetch and compare the latest version of Lapcord with the current version, and notify the user if a new version is available
   */
  private async fetchVersion() {
    try {
      const response = await axios.default.get('https://registry.npmjs.org/lapcord/latest')
      const lapcordPkg = await import('../../package.json')
      const latestVersion = response.data.version
      if (latestVersion > lapcordPkg.version) {
        this.logger.warn(`A new version of Lapcord is available: v${latestVersion} (current version: v${lapcordPkg.version})`)
        this.sendNotification(
          MessageType.Info,
          `There is a new version for Lapcord!\nActual version: v${lapcordPkg.version}, Latest version: v${latestVersion}`
        )
      } else {
        this.logger.log('Lapcord is up to date')
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  /**
   * Resolve JSON to return properties!
   * @param {string} file - File name
   * @example
   * ```js
   * getLanguage('file.py')
   * // output: { LanguageAsset: 'python', LanguageID: 'Python' }
   * ```
   */
  private getLanguage(file: string): LanguageData {
    const { config_files, ext_files } = Languages
    const fileName = file.toLowerCase()
    const fullExtName = extname(fileName) ? fileName.slice(fileName.indexOf('.')) : null

    return config_files[fileName]
      ? { ...config_files[fileName] }
      : ext_files[fullExtName]
      ? { ...ext_files[fullExtName] }
      : ext_files[extname(fileName)]
      ? { ...ext_files[extname(fileName)] }
      : { LanguageID: 'Text', LanguageAsset: ImagesKeys.TEXT }
  }
}
