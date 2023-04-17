import type { TextDocument } from 'vscode-languageserver-textdocument'
import { type Connection, TextDocuments, InitializeParams, ShowMessageNotification, ShowMessageParams } from 'vscode-languageserver'
import {
  ClientOpts,
  CurrentTimestamp,
  ImagesKeys,
  InitializeCapabilities,
  InitializeReturn,
  LanguageData,
  LapcordConfig,
  StatusType
} from '../config'
import { Client, type SetActivity } from '@xhayper/discord-rpc'
import { basename, extname } from 'node:path'
import * as Languages from '../langs/languages.json'

/**
 * Server class that handles event logic and rich presence-related functions
 * - [@xhayper/discord-rpc](https://github.com/xhayper/discord-rpc)
 */
export class Server {
  private client = new Client(ClientOpts)
  // private config: LapcordConfig | null
  // private timeoutId: NodeJS.Timeout | null
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
   * @param {TextDocuments<TextDocument>} document
   * @param {InitializeParams} params
   */
  public onInitialize(document: TextDocuments<TextDocument>, params?: InitializeParams): InitializeReturn {
    // this.config = params?.initializationOptions ?? null
    this.workspaceName = basename(params?.workspaceFolders[0].name ?? 'Not in a workspace!')
    document.listen(this.connection)
    return InitializeCapabilities
  }

  /**
   * Event corresponding to `onInitialized`
   */
  public async onInitialized() {
    const workReporter = await this.connection.window.createWorkDoneProgress()
    workReporter.begin('Discord Presence', 0, 'Connecting...')
    this.client.on('connected', () => {
      this.updateActivity('idle')
      workReporter.report(this.client.user.tag)
    })
    return this.client.login()
  }

  /**
   * Event corresponding to `onDidChangeContent`
   * @param {TextDocument} document
   */
  public async onDidChangeContent(document: TextDocument) {
    this.updateActivity('editing', document)
    // this.setTimeout
  }

  /**
   * Event corresponding to `onWillSave`
   * @param {TextDocument} document
   */
  public async onWillSave(document: TextDocument) {
    this.updateActivity('editing', document)
    // this.setTimeout()
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
      state: status === 'editing' ? `Editing ${fileName}` : 'Idling',
      largeImageKey: status === 'editing' ? languageData.LanguageAsset : ImagesKeys.KEYBOARD,
      smallImageKey: status === 'editing' ? ImagesKeys.LOGO : ImagesKeys.IDLE,
      smallImageText: status === 'editing' ? 'Lapce' : 'Idling',
      startTimestamp: CurrentTimestamp
    }

    if (status === 'editing') {
      Activity.details = `In ${this.workspaceName}`
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

  public onExit() {
    this.client.destroy()
  }

  public onShutdown() {
    this.client.destroy()
  }

  /**
   * Set time out for idling
   * @param {number} time
   * @example
   * ```js
   * setTimeout(2) // 2 minutes
   * ```
   */
  /* private setTimeout(time?: number) {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(async () => {
      this.updateActivity('idle')
    }, time || 1 * 60_000)
  } */
}
