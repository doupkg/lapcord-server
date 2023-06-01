import type { ClientOptions as ClientOpts } from '@xhayper/discord-rpc'
import {
  type HandlerResult,
  type InitializeError,
  type InitializeParams,
  type InitializeResult,
  type NotificationHandler,
  TextDocumentSyncKind
} from 'vscode-languageserver'

export const CurrentTimestamp = new Date()

const clientId = '1093947322708262992'

export const ClientOptions: ClientOpts = {
  clientId,
  transport: {
    type: 'ipc'
  }
}

export const InitializeCapabilities: InitializeReturn = {
  capabilities: {
    textDocumentSync: {
      openClose: true,
      change: TextDocumentSyncKind.Incremental
    }
  },
  serverInfo: {
    name: 'Lapcord',
    version: '2.1.0'
  }
}

export enum LogLevel {
  DEBUG = 0,
  ERROR = 1,
  WARN = 2
}

export enum ImagesKeys {
  LOGO = 'lapce',
  IDLE = 'idle_moon',
  KEYBOARD = 'idle_keyboard',
  TEXT = 'text'
}

export type LanguageData = {
  LanguageID: string
  LanguageAsset: string
}

export type LapcordInitializationOpts = {
  editing?: Partial<{
    details: string
    largeImageText: string
    showTimestamp: boolean
    smallImageText: string
    state: string
  }>
  idle?: Partial<{
    details: string
    largeImageText: string
    showTimestamp: boolean
    smallImageText: string
    state: string
    timeout: number
  }>
}

export type EditingType = {
  file_name: string
  file_ext: string
  language_asset: string
  language_capital: string
  language_id: string
  workspace_name: string
  workspace_path: string
}

export type IdleType = { workspace_name: string; workspace_path: string }

export type StatusType = 'editing' | 'idle'

// rome-ignore lint/suspicious/noExplicitAny: That's native type, Microsoft's fault.
export type InitializeReturn = HandlerResult<InitializeResult<any>, InitializeError>
export type InitializedReturn = NotificationHandler<InitializeParams>
