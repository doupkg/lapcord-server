import type { SetActivity } from '@xhayper/discord-rpc'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { IMAGE_KEYS, LanguageData, StatusType } from '../types'
import { workspaceFolders } from '../server'
import { basename } from 'node:path'
import { MessageType } from 'vscode-languageserver'
import { CurrentTimestamp } from '../server'
import { resolveJson } from './resolveJson'
import { sendNotification } from './sendNotification'
import { Ninth } from './initializeServer'

export async function setActivity(type: StatusType, document?: TextDocument) {
  let language: LanguageData

  if (type === 'editing' && !document) {
    return sendNotification('You need "document" when you use the "editing" type!', MessageType.Error)
  } else if (document) {
    language = resolveJson(document)
  }

  const activityObject: SetActivity = {
    state: getState(type, document),
    largeImageKey: getLargeImageKey(type, language),
    largeImageText: getLargeImageText(type, language),
    smallImageKey: getSmallImageKey(type),
    smallImageText: getSmallImageText(type),
    startTimestamp: CurrentTimestamp
  }

  if (type === 'editing') {
    activityObject.details = getDetails()
  }

  return Ninth.user?.setActivity(activityObject)
}

function getDetails() {
  return 'In ' + basename(workspaceFolders[0].name)
}

function getState(type: StatusType, document?: TextDocument) {
  return type === 'idle' ? 'Idling' : 'Editing ' + document?.uri.split('/').at(-1)
}

function getLargeImageKey(type: StatusType, language?: LanguageData) {
  return type === 'idle' ? IMAGE_KEYS.logo : language ? language.LanguageAsset : IMAGE_KEYS.document
}

function getLargeImageText(type: StatusType, language?: LanguageData) {
  return type === 'idle' ? 'Idling' : language ? 'Editing a ' + language.LanguageId + ' file' : 'Editing a text document'
}

function getSmallImageKey(type: StatusType) {
  return type === 'idle' ? IMAGE_KEYS.idle : IMAGE_KEYS.logo
}

function getSmallImageText(type: StatusType) {
  return type === 'idle' ? 'Idle' : 'Lapce'
}
