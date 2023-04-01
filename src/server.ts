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

process.on('unhandledRejection', (r) => {
  connection.sendNotification(ShowMessageNotification.method, {
    message: `Discord RPC Error: ${r}`,
    type: MessageType.Info,
  } as ShowMessageParams)
  // wdps.report("Error")
  // setTimeout(() => {
  //     wdps.done()
  // })
})

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)
const rpc = new Client({
  clientId: '1084261309677318154',
  transport: { type: 'ipc' },
})

enum IMAGE_KEYS {
  icon_dark = 'logo-dark',
  icon = 'logo-colorful',
  idle = 'idle',
  moon = 'moon',
  file = 'file',
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let rpc_connected = false

connection.onInitialized(async () => {
  const wdps = await connection.window.createWorkDoneProgress()
  wdps.begin('Discord Presence', 0, 'Connecting...')

  rpc.on('connected', () => {
    rpc_connected = true
    wdps.report('Connected')
    setTimeout(() => {
      wdps.report(`${rpc.user?.tag}`)
      setTimeout(() => wdps.done(), 10_000)
    }, 10_000)
    rpc.user?.setActivity({
      largeImageKey: IMAGE_KEYS.icon_dark,
      smallImageKey: IMAGE_KEYS.idle,
      // smallImageText: "",
      // largeImageText: "",
      details: 'Idle',
      // state: "",
      startTimestamp: Date.now(),
    })
  })

  rpc.login().catch((r) => {
    wdps.report('Error')
    connection.sendNotification(ShowMessageNotification.method, {
      message: `Discord RPC Error: ${r}`,
      type: MessageType.Info,
    } as ShowMessageParams)
    setTimeout(() => {
      wdps.done()
    }, 10_000)
  })
})

// documents.onDidOpen(({ document }) => {
//     if (!rpc_connected) return;
//     rpc.user?.setActivity({
//         largeImageKey: IMAGE_KEYS.file,
//         largeImageText: `Editing a ${document.languageId.toUpperCase()} file`,
//         smallImageKey: IMAGE_KEYS.icon,
//         smallImageText: "Lapce",
//         details: `Editing ${document.uri.split("/").at(-1)}`,
//         startTimestamp: Date.now()
//     });
// });

// documents.onDidClose(() => {
//     if (!rpc_connected) return;
//     rpc.user?.setActivity({
//         largeImageKey: IMAGE_KEYS.icon_dark,
//         smallImageKey: IMAGE_KEYS.idle,
//         // smallImageText: "",
//         // largeImageText: "",
//         details: "Idle",
//         // state: "",
//         startTimestamp: Date.now()
//     });
// });

connection.onExit(() => {
  rpc.destroy()
})

documents.listen(connection)
connection.listen()
