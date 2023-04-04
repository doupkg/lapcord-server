#! /usr/bin/env node
import { createConnection, MessageType, ProposedFeatures, ShowMessageNotification, ShowMessageParams, TextDocuments, TextDocumentSyncKind, WorkDoneProgressReporter } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { existsSync } from 'node:fs'
import { writeFile, unlink } from 'node:fs/promises'
import { Client, SetActivity } from '@xhayper/discord-rpc'
import * as path from 'node:path'
import * as os from 'node:os'
import * as languageData from '../assets/languages.json'

const connection = createConnection(ProposedFeatures.all)
const documents = new TextDocuments(TextDocument)

const client = new Client({
  clientId: '1084261309677318154',
  transport: {
    type: 'ipc'
  }
})

const LockFile = path.join(os.tmpdir(), 'discord-rpc.lock')
const CurrentTimestamp = Date.now()
let wdps: WorkDoneProgressReporter
let rpcConection = false
let rootUri: string
let timerId: NodeJS.Timeout | null = null

enum IMAGE_KEYS {
  logo = 'logo-app',
  idle = 'idle'
}

interface LanguageData {
  LanguageId: string
  LanguageAsset: string
}

type Type = 'idle' | 'editing'

async function setActivity(type: Type, document?: TextDocument): Promise<void> {
  let Language: LanguageData

  if (type === 'editing' && !document) return sendNotification('You need document when use Editing type!', MessageType.Error)
  if (document) {
    Language = resolveJSON(document.uri)
  }

  const activityObject: SetActivity = {
    state: type === 'idle' ? 'Idling' : 'Editing ' + document?.uri.split('/').at(-1),
    largeImageKey: type === 'idle' ? IMAGE_KEYS.logo : Language ? Language.LanguageAsset : 'file',
    largeImageText: type === 'idle' ? 'Idling' : Language ? 'Editing a ' + Language.LanguageId + ' file' : 'Editing a file',
    smallImageKey: type === 'idle' ? IMAGE_KEYS.idle : IMAGE_KEYS.logo,
    smallImageText: type === 'idle' ? 'Idle' : 'Lapce',
    startTimestamp: CurrentTimestamp
  }

  if (type === 'editing') {
    activityObject.details = 'In ' + path.basename(rootUri.slice(7, -1))
  }

  client.user?.setActivity(activityObject)
}

function startTimer(document: TextDocument, time?: number) {
  if (timerId) clearTimeout(timerId)
  timerId = setTimeout(async () => {
    if (documents.get(document.uri)) setActivity('idle')
    if (existsSync(LockFile)) unlink(LockFile)
  }, time || 10000)
}

function resolveJSON(uri: string): LanguageData | null {
  const extension = path.extname(uri) || null
  return languageData[extension] ? { ...languageData[extension] } : null
}

async function setUp() {
  wdps = await connection.window.createWorkDoneProgress()
  wdps.begin('Discord Presence', 0, 'Connecting...')

  const lock = await createLock()
  if (!lock) return wdps.report('Already connected!')

  client.on('connected', () => {
    rpcConection = true
    wdps.report(client.user?.tag as string)
    if (client.user) setActivity('idle')
  })

  client.login()
}

async function createLock(): Promise<boolean> {
  if (existsSync(LockFile)) return false
  await writeFile(LockFile, process.pid.toString())
  return true
}

function sendNotification(message: string, type: MessageType) {
  connection.sendNotification(ShowMessageNotification.method, {
    message,
    type
  } as ShowMessageParams)
}

documents.onDidSave(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  startTimer(document)
})

documents.onDidChangeContent(({ document }) => {
  if (!rpcConection) return null
  setActivity('editing', document)
  startTimer(document)
})

connection.onInitialized(() => setUp())

connection.onInitialize((params) => {
  rootUri = params.rootUri
  documents.listen(connection)

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

process.on('unhandledRejection', (e) => {
  sendNotification('Error: ' + e, MessageType.Error)
  wdps.report('Error')
})

connection.listen()
