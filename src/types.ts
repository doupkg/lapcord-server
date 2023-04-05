export enum IMAGE_KEYS {
  logo = 'logo-app',
  idle = 'idle',
  document = 'document'
}

export interface LanguageData {
  LanguageId: string
  LanguageAsset: string
}

export type StatusType = 'idle' | 'editing'
