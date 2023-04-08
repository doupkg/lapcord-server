import type { SetActivity } from '@xhayper/discord-rpc'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { basename, extname } from 'node:path'
import { IMAGE_KEYS, LanguageData, StatusType } from '../types'
import { workspaceFolders, CurrentTimestamp } from '../server'
import { Ninth, sendNotification } from './index'
import * as LanguagesJson from '../langs/languages.json'

const truncateString = (ctx: string) => {
  return ctx.length > 128 ? `${ctx.slice(0, 125)}...` : ctx
}

export async function setActivity(type: StatusType, document?: TextDocument) {
  let language: LanguageData

  if (type === 'editing' && !document)
    return sendNotification('You must pass the argument Document when working with "editing" type.', 1)
  if (type === 'editing') language = resolveJson(document)

  const activityObject: SetActivity = {
    state: getState(type, document),
    details: getDetails(),
    largeImageKey: getLargeImageKey(type, language),
    smallImageKey: getSmallImageKey(type),
    smallImageText: getSmallImageText(type),
    startTimestamp: CurrentTimestamp
  }

  if (type === 'editing') activityObject.largeImageText = getLargeImageText(language)

  return Ninth.user.setActivity(activityObject)
}

function getDetails() {
  return `In ${truncateString(getWorkspaceName())}`
}

function getState(type: StatusType, document?: TextDocument) {
  return type === 'idle' ? 'Idling' : `Editing ${truncateString(getFileName(document))}`
}

function getLargeImageKey(type: StatusType, language?: LanguageData) {
  return type === 'idle' ? IMAGE_KEYS.KEYBOARD : language.LanguageAsset
}

function getLargeImageText(language: LanguageData) {
  return `Editing a ${language.LanguageId.toUpperCase()} file`
}

function getSmallImageKey(type: StatusType) {
  return type === 'idle' ? IMAGE_KEYS.IDLE : IMAGE_KEYS.LOGO
}

function getSmallImageText(type: StatusType) {
  return type === 'idle' ? 'Sleeping' : 'Lapce'
}

function getWorkspaceName() {
  if (!workspaceFolders[0]) return 'No workspace'
  return decodeURIComponent(basename(workspaceFolders[0].name))
}

function getFileName(document: TextDocument) {
  return decodeURIComponent(basename(document.uri))
}

function resolveJson(document: TextDocument): LanguageData {
  const FileName = getFileName(document).toLowerCase()
  const ExtensionName = extname(FileName) ? FileName.slice(FileName.indexOf('.')) : null

  return LanguagesJson[FileName]
    ? { ...LanguagesJson[FileName] }
    : LanguagesJson[ExtensionName]
    ? { ...LanguagesJson[ExtensionName] }
    : { LanguageId: 'Text', LanguageAsset: IMAGE_KEYS.TEXT }
}
