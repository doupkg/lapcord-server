import { Connection } from 'vscode-languageserver/node'
import { LogLevel } from '../config'

export class Logger {
  constructor(protected connection: Connection) {}

  private print(type: LogLevel, message: string) {
    if (type < 0 || type > 2) return this.connection.console.error("[lapcord-server] Invalid level's enum")
    return type === 0
      ? this.connection.console.log(`[lapcord-server] ${message}`)
      : type === 1
      ? this.connection.console.error(`[lapcord-server] ${message}`)
      : this.connection.console.warn(`[lapcord-server] ${message}`)
  }

  public log(message: string) {
    this.print(LogLevel.DEBUG, message)
  }

  public error(message: string) {
    this.print(LogLevel.ERROR, message)
  }

  public warn(message: string) {
    this.print(LogLevel.WARN, message)
  }
}
