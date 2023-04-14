export enum IMAGE_KEYS {
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

export type StatusType = 'idle' | 'editing'
