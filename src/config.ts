import type { ClientOptions } from '@xhayper/discord-rpc'
import {
  type HandlerResult,
  type InitializeError,
  type InitializeParams,
  type InitializeResult,
  type NotificationHandler,
  TextDocumentSyncKind
} from 'vscode-languageserver'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

export const LockFile = join(tmpdir(), 'discord-rpc.lock')
export const CurrentTimestamp = new Date()

const clientId = '1093947322708262992'

export const ClientOpts: ClientOptions = {
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

export interface LanguageData {
  LanguageID: string
  LanguageAsset: string
}

export interface LapcordConfig {
  timeoutToIdle?: string
  editing?: PresenceConfigOpts
  idle?: PresenceConfigOpts
}

export interface PresenceConfigOpts {
  state?: string
  details?: string
  showTimestamp?: boolean
  largeImageText?: string
  smallImageText?: string
}

export type StatusType = 'editing' | 'idle'

// rome-ignore lint/suspicious/noExplicitAny: That's native type, Microsoft's fault.
export type InitializeReturn = HandlerResult<InitializeResult<any>, InitializeError>
export type InitializedReturn = NotificationHandler<InitializeParams>
