import { Client, SetActivity } from '@xhayper/discord-rpc'
import {
  ClientOptions,
  CurrentTimestamp,
  EditingType,
  IdlingType,
  ImagesKeys,
  LanguageData,
  LapcordInitializationOpts,
  StatusType
} from '../config'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Connection, InitializeParams } from 'vscode-languageserver'
import { basename, extname } from 'node:path'
import * as Languages from '../langs/languages.json'
import * as Mustache from 'mustache'

export class ActivityProxy {
  public container: Client
  public options: LapcordInitializationOpts
  private workspaceName: string
  private workspacePath: string

  constructor(protected connection: Connection, protected params: InitializeParams) {
    this.options = params.initializationOptions
    this.container = new Client(ClientOptions)
    this.workspaceName = basename(params.workspaceFolders[0].name)
    this.workspacePath = params.workspaceFolders[0].name
  }

  public update(status: StatusType, document?: TextDocument) {
    const activity: SetActivity = {}

    let editingView: EditingType
    let idlingView: IdlingType

    if (!['editing', 'idling'].includes(status)) return this.connection.console.error('Invalid type at StatusType')

    if (status === 'editing') {
      if (!document) return this.connection.console.error("Document doesn't been declarated!")

      const fileName = this.getFileName(document)
      const { LanguageAsset, LanguageID } = this.getLanguage(fileName)

      editingView = {
        fileName: fileName,
        languageAsset: LanguageAsset,
        languageId: LanguageID,
        languageUpper: LanguageID.toUpperCase(),
        workspaceName: this.workspaceName,
        workspacePath: this.workspacePath
      }

      if (this.options.editing.showTimestamp) activity.startTimestamp = CurrentTimestamp

      activity.details = this.truncateString(
        Mustache.render(
          this.checkString(this.options.editing.details) ? this.options.editing.details : 'In {{workspaceName}}',
          editingView
        )
      )
      activity.largeImageText = this.truncateString(
        Mustache.render(
          this.checkString(this.options.editing.largeImageText)
            ? this.options.editing.largeImageText
            : 'Editing a {{languageUpper}} file',
          editingView
        )
      )
    }

    if (status === 'idling') {
      if (this.options.idle.showTimestamp) activity.startTimestamp = CurrentTimestamp

      idlingView = {
        workspaceName: this.workspaceName,
        workspacePath: this.workspacePath
      }

      if (this.checkString(this.options.idle.details))
        activity.details = this.truncateString(Mustache.render(this.options.idle.details, idlingView))
    }

    activity.state = this.truncateString(
      status === 'editing'
        ? Mustache.render(
            this.checkString(this.options.editing.state) ? this.options.editing.state : 'Editing {{fileName}}',
            editingView
          )
        : Mustache.render(this.checkString(this.options.idle.state) ? this.options.idle.state : 'Idling', idlingView)
    )

    activity.smallImageText = this.truncateString(
      status === 'editing'
        ? Mustache.render(
            this.checkString(this.options.editing.smallImageText) ? this.options.editing.smallImageText : 'Lapce',
            editingView
          )
        : Mustache.render(
            this.checkString(this.options.idle.smallImageText) ? this.options.idle.smallImageText : 'Idling',
            idlingView
          )
    )

    activity.largeImageKey = status === 'editing' ? editingView.languageAsset : ImagesKeys.KEYBOARD
    activity.smallImageKey = status === 'editing' ? ImagesKeys.LOGO : ImagesKeys.IDLE

    return this.container.user.setActivity(activity)
  }

  private checkString(ctx: string) {
    return ctx.trim() !== '' && ctx.trim().length > 2
  }

  private getFileName(document: TextDocument) {
    return decodeURIComponent(basename(document.uri))
  }

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

  private truncateString(ctx: string) {
    return ctx.trim().length >= 50 ? `${ctx.trim().slice(0, 50)}...` : ctx.trim()
  }
}
