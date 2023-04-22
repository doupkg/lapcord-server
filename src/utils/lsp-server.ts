import type { TextDocument } from 'vscode-languageserver-textdocument'
import { type Connection, InitializeParams, TextDocuments } from 'vscode-languageserver'
import { Client, type SetActivity } from '@xhayper/discord-rpc'
import { basename, extname } from 'node:path'
import {
  ClientOpts,
  CurrentTimestamp,
  ImagesKeys,
  InitializeCapabilities,
  InitializeReturn,
  InitializedReturn,
  LanguageData,
  StatusType
} from '../config'
import * as Languages from '../langs/languages.json'

/**
 * Server class that handles event logic and rich presence-related functions
 * - [@xhayper/discord-rpc](https://github.com/xhayper/discord-rpc)
 */
export class Server {
  private client = new Client(ClientOpts)
  private workspaceName: string

  /**
   * Sets up a new server instance.
   * @param {Connection} connection - `vscode-languageserver` Connection
   * @example
   * ```js
   * new Server(connection) // Connection
   * ```
   */
  constructor(protected connection: Connection) {}

  /**
   * Event corresponding to `onInitialize`
   * @param {InitializeParams} params
   */
  public onInitialize(params?: InitializeParams): InitializeReturn {
    this.workspaceName = basename(params?.workspaceFolders[0].name ?? 'Not in a workspace!')
    return InitializeCapabilities
  }

  /**
   * Event corresponding to `onInitialized`
   */
  public async onInitialized(documents: TextDocuments<TextDocument>): Promise<InitializedReturn> {
    const workReporter = await this.connection.window.createWorkDoneProgress()
    workReporter.begin('Discord Presence', 50, 'Connecting...')
    this.client.on('connected', () => {
      workReporter.report(100, this.client.user?.tag)
      this.updateActivity('idle')
      documents.onDidChangeContent((x) => this.updateActivity('editing', x.document))
      documents.onWillSave((x) => this.onWillSave(x.document))
    })
    this.client.login()
    return
  }

  /**
   * Event corresponding to `onExit`
   */
  public onExit() {
    this.client.destroy()
  }

  /**
   * Event corresponding to `onShutdown`
   */
  public onShutdown() {
    this.client.destroy()
  }

  /**
   * Event corresponding to `onDidChangeContent`
   * @param {TextDocument} document
   */
  public async onDidChangeContent(document: TextDocument) {
    this.updateActivity('editing', document)
  }

  /**
   * Event corresponding to `onWillSave`
   * @param {TextDocument} document
   */
  public async onWillSave(document: TextDocument) {
    this.updateActivity('editing', document)
  }

  /**
   * Method for update rich presence
   * @param {StatusType} status - User status
   * @param {TextDocument} document - Text document
   * @example
   * ```js
   * updateActivity('idle') // output: Promise<void>
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
   * Get converted file name
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
   * Resolve JSON to return properties!
   * @param {string} file - File name
   * @example
   * ```js
   * getLanguage('file.py') // output: { LanguageAsset: 'python', LanguageID: 'Python' }
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
