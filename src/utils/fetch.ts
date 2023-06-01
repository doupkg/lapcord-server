import { MessageType } from 'vscode-languageserver/node'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { Logger } from './logger'
import * as axios from 'axios'

async function checkCache(): Promise<{ current: string; latest: string }> {
  const cachePath = join(__dirname, '..', '..', '.cache')
  const cacheFile = join(cachePath, 'version.json')
  const cacheDuration = 60 * 60 * 1000
  const lapcordPkg = await import('../../package.json')
  const currentVersion = lapcordPkg.version

  if (!existsSync(cachePath)) await mkdir(cachePath)

  if (existsSync(cacheFile)) {
    const { current, latest, timestamp } = await import(cacheFile)
    const currentTimestamp = Date.now()

    if (currentTimestamp - timestamp >= cacheDuration) {
      const response = await axios.default.get('https://registry.npmjs.org/lapcord/latest')
      const latestVersion = response.data.version
      await writeFile(
        cacheFile,
        JSON.stringify({ current: currentVersion, latest: latestVersion, timestamp: currentTimestamp })
      )
      return { current: currentVersion, latest: latestVersion }
    } else {
      return { current, latest }
    }
  } else {
    const response = await axios.default.get('https://registry.npmjs.org/lapcord/latest')
    const latestVersion = response.data.version
    await writeFile(
      cacheFile,
      JSON.stringify({ current: currentVersion, latest: latestVersion, timestamp: Date.now() })
    )
    return { current: currentVersion, latest: latestVersion }
  }
}

export async function fetchVersion(logger: Logger) {
  try {
    const { current, latest } = await checkCache()
    if (latest > current) {
      logger.warn(`A new version of Lapcord is available: v${latest} (current version: v${current})`)
      this.sendNotification(
        MessageType.Info,
        `A new version of Lapcord is available: v${latest}\n(current version: v${current})`
      )
    } else {
      logger.log('Lapcord is up to date')
    }
  } catch (e) {
    logger.error(e)
  }
}
