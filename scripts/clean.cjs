const { bold, green, red } = require('colorette')
const { rm } = require('node:fs/promises')
const { existsSync } = require('node:fs')
;(async () => {
  const date = new Date()
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }
  const lib = './lib/'
  if (!existsSync(lib))
    return console.log(
      `[${bold(date.toLocaleString('en-US', options).replace(/,/g, ''))}] ${red('Error')}: lib/ doesn't exists`
    )
  await rm(lib, { recursive: true })
  return console.log(
    `[${bold(date.toLocaleString('en-US', options).replace(/,/g, ''))}] ${green(
      'Success'
    )}: lib/ directory has been removed`
  )
})()
