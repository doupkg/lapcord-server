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

export type StatusType = 'idle' | 'editing'
