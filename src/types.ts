export enum IMAGE_KEYS {
  LOGO = 'lapce',
  IDLE = 'idle',
  KEYBOARD = 'keyboard_idling',
  TEXT = 'text'
}

export interface LanguageData {
  LanguageId: string
  LanguageAsset: string
}

export type StatusType = 'idle' | 'editing'
