import type { ClientOptions } from '@xhayper/discord-rpc'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { InitializeError, HandlerResult, InitializeResult } from 'vscode-languageserver'

export const LockFile = join(tmpdir(), 'discord-rpc.lock')
export const CurrentTimestamp = new Date()

const ClientID = '1093947322708262992'

export const ClientOpts: ClientOptions = {
  clientId: ClientID,
  transport: {
    type: 'ipc'
  }
}

export const InitializeCapabilities: InitializeReturn = {
  capabilities: {
    textDocumentSync: {
      openClose: true,
      change: 2
    }
  },
  serverInfo: {
    name: 'Lapcord',
    version: '2.1.0'
  }
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
