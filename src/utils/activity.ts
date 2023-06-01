import { Client, type SetActivity } from '@xhayper/discord-rpc'
import {
  ClientOptions,
  CurrentTimestamp,
  type EditingType,
  type IdleType,
  ImagesKeys,
  type LanguageData,
  type LapcordInitializationOpts,
  type StatusType
} from '../config'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { Connection, InitializeParams } from 'vscode-languageserver'
import { basename, extname } from 'node:path'
import * as Languages from '../langs/languages.json'
import * as Mustache from 'mustache'

export class ActivityProxy {
  public container: Client
  public options: LapcordInitializationOpts
  private timeout: NodeJS.Timeout
  private state: boolean = false
  private workspaceName: string
  private workspacePath: string

  constructor(protected connection: Connection, protected params: InitializeParams) {
    this.container = new Client(ClientOptions)
    this.workspaceName = basename(params.workspaceFolders[0].name)
    this.workspacePath = params.workspaceFolders[0].name
    this.options = params.initializationOptions
  }

  private checkString(ctx: string) {
    return ctx.trim() !== '' && ctx.trim().length > 2
  }

  public set enabled(value: boolean) {
    this.state = value
  }

  public get enabled() {
    return this.state
  }

  private getLanguage(fileName: string, fullExtName: string): LanguageData {
    const { config_files, ext_files } = Languages

    return config_files[fileName]
      ? { ...config_files[fileName] }
      : ext_files[fullExtName]
      ? { ...ext_files[fullExtName] }
      : ext_files[extname(fileName)]
      ? { ...ext_files[extname(fileName)] }
      : { LanguageID: 'Text', LanguageAsset: ImagesKeys.TEXT }
  }

  private getFileName(document: TextDocument) {
    return decodeURIComponent(basename(document.uri))
  }

  public update(status: StatusType, document?: TextDocument) {
    if (!this.state) return null

    const activity: SetActivity = {}

    let editingView: EditingType
    let idleView: IdleType

    if (!['editing', 'idle'].includes(status)) return this.connection.console.error('Invalid type at StatusType')

    if (status === 'editing') {
      if (!document) return this.connection.console.error("Document doesn't been declarated!")

      const fileName = this.getFileName(document).toLowerCase()
      const fileExtension = extname(fileName) ? fileName.slice(fileName.indexOf('.')) : 'does not have extension'

      const { LanguageAsset: languageAsset, LanguageID: languageID } = this.getLanguage(
        fileName,
        fileExtension
      )

      editingView = {
        file_name: fileName,
        file_ext: fileExtension,
        language_asset: languageAsset,
        language_capital: languageID.toUpperCase(),
        language_id: languageID,
        workspace_name: this.workspaceName,
        workspace_path: this.workspacePath
      }

      if (this.options.editing.showTimestamp) activity.startTimestamp = CurrentTimestamp

      activity.details = this.truncateString(
        Mustache.render(
          this.checkString(this.options.editing.details) ? this.options.editing.details : 'In {{workspace_name}}',
          editingView
        )
      )

      activity.largeImageText = this.truncateString(
        Mustache.render(
          this.checkString(this.options.editing.largeImageText)
            ? this.options.editing.largeImageText
            : 'Editing a {{language_capital}} file',
          editingView
        )
      )

      this.connection.console.log(`${JSON.stringify(this.options.idle)}`)

      if (this.timeout) clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        this.update('idle')
      }, (!this.options.idle.timeout ? 60 : this.options.idle.timeout >= 15 ? this.options.idle.timeout : 15) * 1000)
    }

    if (status === 'idle') {
      if (this.options.idle.showTimestamp) activity.startTimestamp = CurrentTimestamp

      idleView = {
        workspace_name: this.workspaceName,
        workspace_path: this.workspacePath
      }

      if (this.checkString(this.options.idle.details))
        activity.details = this.truncateString(Mustache.render(this.options.idle.details, idleView))

      if (this.checkString(this.options.idle.largeImageText))
        activity.largeImageText = this.truncateString(Mustache.render(this.options.idle.largeImageText, idleView))
    }

    activity.state = this.truncateString(
      status === 'editing'
        ? Mustache.render(
            this.checkString(this.options.editing.state) ? this.options.editing.state : 'Editing {{file_name}}',
            editingView
          )
        : Mustache.render(this.checkString(this.options.idle.state) ? this.options.idle.state : 'Idling', idleView)
    )

    activity.smallImageText = this.truncateString(
      status === 'editing'
        ? Mustache.render(
            this.checkString(this.options.editing.smallImageText) ? this.options.editing.smallImageText : 'Lapce',
            editingView
          )
        : Mustache.render(
            this.checkString(this.options.idle.smallImageText) ? this.options.idle.smallImageText : 'Sleeping',
            idleView
          )
    )

    activity.largeImageKey = status === 'editing' ? editingView.language_asset : ImagesKeys.KEYBOARD
    activity.smallImageKey = status === 'editing' ? ImagesKeys.LOGO : ImagesKeys.IDLE

    return this.container.user.setActivity(activity)
  }

  private truncateString(ctx: string) {
    return ctx.trim().length >= 50 ? `${ctx.trim().slice(0, 50)}...` : ctx.trim()
  }
}
