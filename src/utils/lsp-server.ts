import type { TextDocument } from 'vscode-languageserver-textdocument'
import {
  Connection,
  InitializeParams,
  MessageType,
  TextDocuments,
  ShowMessageParams,
  WorkDoneProgressReporter
} from 'vscode-languageserver'
import { basename } from 'node:path'
import { InitializeCapabilities, type InitializeReturn } from '../config'
import { ActivityProxy } from './activity'
import { Logger } from './logger'
import * as axios from 'axios'

export class Server {
  private logger = new Logger(this.connection)
  private client: ActivityProxy
  private workReporter: WorkDoneProgressReporter

  constructor(protected connection: Connection) {}

  private async fetchVersion() {
    try {
      const response = await axios.default.get('https://registry.npmjs.org/lapcord/latest')
      const lapcordPkg = await import('../../package.json')
      const latestVersion = response.data.version
      if (latestVersion > lapcordPkg.version) {
        this.logger.warn(
          `A new version of Lapcord is available: v${latestVersion} (current version: v${lapcordPkg.version})`
        )
        this.sendNotification(
          MessageType.Info,
          `There is a new version for Lapcord!\nCurrent version: v${lapcordPkg.version}, Latest version: v${latestVersion}`
        )
      } else {
        this.logger.log('Lapcord is up to date')
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  public onError(error: unknown) {
    this.logger.error(`${error}`)
    this.workReporter.report(0, 'Error')
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

    await this.fetchVersion()

    this.client.container.on('connected', () => {
      this.logger.log(`Client logged (${this.client.container.user?.tag} has been hacked)`)
      this.workReporter.report(100, this.client.container.user?.tag)
      this.client.update('idling')

      documents.onDidChangeContent((x) => this.client.update('editing', x.document))
      documents.onWillSave((x) => this.onWillSave(x.document))
    })

    await this.client.container.login()
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
}
