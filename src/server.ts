#! /usr/bin/env node

import {
  createConnection,
  ProposedFeatures,
  TextDocumentSyncKind,
  InitializeResult,
  ShowMessageNotification,
  ShowMessageParams,
  MessageType,
  TextDocuments,
} from 'vscode-languageserver/node'

import { TextDocument } from 'vscode-languageserver-textdocument'

import { Client } from '@xhayper/discord-rpc'

const connection = createConnection(ProposedFeatures.all)
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

const rpc = new Client({
  clientId: '1084261309677318154',
  transport: { type: 'ipc' },
})

connection.onInitialize(() => {
  connection.console.log('Lapcord Initialialized!')
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Incremental,
      },
    },
    serverInfo: {
      name: 'Lapcord',
      version: '0.0.1',
    },
  }
  return result
})

connection.onInitialized(async () => {
  const wdps = await connection.window.createWorkDoneProgress()
  wdps.begin('Discord Presence', 0, 'Connecting...')
  await rpc.login().catch((r) => {
    wdps.report('Error')
    connection.sendNotification(ShowMessageNotification.method, {
      message: `Discord RPC Error: ${r}`,
      type: MessageType.Info,
    } as ShowMessageParams)
    setTimeout(() => wdps.done(), 10_000)
  })
  // rpc.on("ready", () => {
  //     connection.sendNotification(ShowMessageNotification.method, {
  //         message: `Discord Presence Ready`,
  //         type: MessageType.Info,
  //     } as ShowMessageParams)
  // })
  // rpc.on("disconnected", () => {
  //     wdps.report("Disconnected")
  // })
  // rpc.on("connected", () => {
  //     wdps.report("Connected")
  // })
})

// documents.onDidOpen((params) => {
//     connection.sendNotification(ShowMessageNotification.method, {
//         message: `Document opened ${params.document.uri}`,
//         type: MessageType.Info,
//     } as ShowMessageParams)
// })

// documents.onDidClose(() => {
//     connection.sendNotification(ShowMessageNotification.method, {
//         message: "Document closed!",
//         type: MessageType.Info,
//     } as ShowMessageParams)
// })

// connection.onDidOpenTextDocument((params: DidOpenTextDocumentParams) => {
//     // connection.console.log("Document opened!")
//     connection.sendNotification(ShowMessageNotification.method, {
//         message: `Document opened ${params.textDocument.uri}`,
//         type: MessageType.Info,
//     } as ShowMessageParams)
// });

// connection.onDidChangeWatchedFiles(() => {
//     connection.sendNotification(ShowMessageNotification.method, {
//         message: "Document changed!",
//         type: MessageType.Info,
//     } as ShowMessageParams)
// })

// connection.onDidCloseTextDocument(() => {
//     connection.sendNotification(ShowMessageNotification.method, {
//         message: "Document closed!",
//         type: MessageType.Info,
//     } as ShowMessageParams)
// })

documents.listen(connection)
connection.listen()
