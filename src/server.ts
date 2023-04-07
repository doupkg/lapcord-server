#! /usr/bin/env node
import type { WorkspaceFolder } from 'vscode-languageserver/node'
import { createConnection, MessageType, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { initializeServer, Ninth, rpcConection, sendNotification, setActivity, workDoneProgress } from './utils'

export const Connection = createConnection(ProposedFeatures.all)
export const CurrentTimestamp = Date.now()
export const Documents = new TextDocuments(TextDocument)
export let workspaceFolders: WorkspaceFolder[]

Documents.onDidSave(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  // startTimer(document)
})

Documents.onDidChangeContent(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  // startTimer(document)
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

Connection.onExit(async () => await Ninth.destroy())
Connection.onShutdown(async () => await Ninth.destroy())

process.on('unhandledRejection', (e) => {
  sendNotification(`Error: ${e}`, MessageType.Error)
  workDoneProgress.report('Error')
})
