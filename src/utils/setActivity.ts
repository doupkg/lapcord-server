import type { SetActivity } from '@xhayper/discord-rpc'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { IMAGE_KEYS, LanguageData, StatusType } from '../types'
import { workspaceFolders } from '../server'
import { basename } from 'node:path'
import { MessageType } from 'vscode-languageserver'
import { CurrentTimestamp } from '../server'
import { resolveJson } from './resolveJson'
import { sendNotification, Ninth } from './index'

export async function setActivity(type: StatusType, document?: TextDocument) {
  let language: LanguageData

  if (type === 'editing' && !document) {
    return sendNotification('You need "document" when you use the "editing" type!', MessageType.Error)
  } else if (document) {
    language = resolveJson(document)
  }

  const activityObject: SetActivity = {
    state: getState(type, document),
    details: getDetails(),
    largeImageKey: getLargeImageKey(type, language),
    largeImageText: getLargeImageText(type, language),
    smallImageKey: getSmallImageKey(type),
    smallImageText: getSmallImageText(type),
    startTimestamp: CurrentTimestamp
  }

  return Ninth.user.setActivity(activityObject)
}

function getDetails() {
  const str = basename(decodeURIComponent(workspaceFolders[0].name))
  return `In ${sliceString(str)}`
}

function getState(type: StatusType, document?: TextDocument) {
  const str = decodeURIComponent(document.uri.split('/').at(-1))
  return type === 'idle' ? 'Idling' : `Editing ${sliceString(str)}`
}

function getLargeImageKey(type: StatusType, language?: LanguageData) {
  return type === 'idle' ? IMAGE_KEYS.KEYBOARD : language ? language.LanguageAsset : IMAGE_KEYS.TEXT
}

function getLargeImageText(type: StatusType, language?: LanguageData) {
  return type === 'idle' ? 'Lapce' : language ? `Editing a ${language.LanguageId} file` : 'Editing a Text document'
}

function getSmallImageKey(type: StatusType) {
  return type === 'idle' ? IMAGE_KEYS.IDLE : IMAGE_KEYS.LOGO
}

function getSmallImageText(type: StatusType) {
  return type === 'idle' ? 'Idle' : 'Lapce'
}

function sliceString(ctx: string) {
  return ctx.length > 128 ? `${ctx.slice(0, 125)}...` : ctx
}
