import type { ShowMessageParams } from 'vscode-languageserver'
import { MessageType, ShowMessageNotification } from 'vscode-languageserver'
import { Connection } from '../server'

export function sendNotification(message: string, type: MessageType) {
  return Connection.sendNotification(ShowMessageNotification.method, {
    message,
    type
  } as ShowMessageParams)
}
