#! /usr/bin/env node
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  type WorkspaceFolder
} from 'vscode-languageserver/node'
import {
  initializeServer,
  Ninth,
  rpcConection,
  sendNotification,
  setActivity,
  startTimer,
  workDoneProgress
} from './utils'
import { TextDocument } from 'vscode-languageserver-textdocument'

export const Connection = createConnection(ProposedFeatures.all)
export const CurrentTimestamp = Date.now()
export const Documents = new TextDocuments(TextDocument)
export let workspaceFolders: WorkspaceFolder[]

Documents.onDidSave(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  startTimer(document)
})

Documents.onDidChangeContent(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  startTimer(document)
})

Connection.onInitialize((params) => {
  workspaceFolders = params.workspaceFolders
  Documents.listen(Connection)
  return {
    capabilities: {
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Incremental
      }
    },
    serverInfo: {
      name: 'Lapcord',
      version: '6.6.6'
    }
  }
})

Connection.onInitialized(() => initializeServer())

Connection.listen()

Connection.onExit(async () => {
  await workDoneProgress.done()
  await Ninth.destroy()
})

Connection.onShutdown(async () => {
  await workDoneProgress.done()
  await Ninth.destroy()
})

process.on('unhandledRejection', (e) => {
  sendNotification(`Error: ${e}`, 1)
  workDoneProgress.report('Error')
})
