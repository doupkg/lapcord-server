export enum IMAGE_KEYS {
  logo = 'lapce',
  idle = 'idle',
  document = 'document'
}

export interface LanguageData {
  LanguageId: string
  LanguageAsset: string
}

export type StatusType = 'idle' | 'editing'
