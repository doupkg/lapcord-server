import type { TextDocument } from 'vscode-languageserver-textdocument'
import {
  Connection,
  InitializeParams,
  MessageType,
  TextDocuments,
  ShowMessageParams,
  WorkDoneProgressReporter
} from 'vscode-languageserver'
import { InitializeCapabilities, type InitializeReturn } from '../config'
import { ActivityProxy } from './activity'
import { Logger } from './logger'
import { fetchVersion } from './fetch'

export class Server {
  private logger = new Logger(this.connection)
  private client: ActivityProxy
  private workReporter: WorkDoneProgressReporter

  constructor(protected connection: Connection) {}

  public onError(error: unknown) {
    this.logger.error(`${error}`)
    this.workReporter.report(0, 'An error has occurred')
    this.sendNotification(1, `${error}`)
  }

  public onDidChangeContent(document: TextDocument) {
    this.client.update('editing', document)
  }

  public onInitialize(params: InitializeParams): InitializeReturn {
    this.logger.log('Initializating server')

    this.client = new ActivityProxy(this.connection, params)

    return InitializeCapabilities
  }

  public async onInitialized(documents: TextDocuments<TextDocument>): Promise<void> {
    this.workReporter = await this.connection.window.createWorkDoneProgress()

    this.workReporter.begin('Discord Presence', 50, 'Connecting...')
    this.logger.log('Server initialized')

    this.client.container.on('connected', () => {
      this.logger.log(`Client logged (${this.client.container.user?.tag} has been hacked)`)
      this.workReporter.report(100, this.client.container.user?.tag)
      this.client.enabled = true
      this.client.update('idle')

      documents.onDidChangeContent((x) => this.client.update('editing', x.document))
      documents.onWillSave((x) => this.onWillSave(x.document))
    })

    await this.client.container.login()
    await fetchVersion(this.logger)
  }

  public onWillSave(document: TextDocument) {
    this.client.update('editing', document)
  }

  public sendNotification(type: MessageType, message: string) {
    this.connection.sendNotification('window/showMessage', {
      message,
      type
    } as ShowMessageParams)
  }

  private startTimeout() {}
}
