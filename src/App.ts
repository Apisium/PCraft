import y18n from 'y18n'
import { join } from 'path'
import { createInterface } from 'readline'

import color from './colors'
import Y18n from './type/Y18n'
import Application from './Application'
import loadPlugin from './plugin/loadPlugin'

const { pcraft } = require('../package.json')
const { error, warn, info, log } = console
const { red, gold, green, gray } = color

const apps = {}
const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')

const S = Symbol()
export default (server: any, { locale = 'zh_CN', dependencies = {} }) => {
  const y = y18n({ locale, directory: join(__dirname, '../locales') })
  const _ = y.__
  const ERROR = LEFT + red(y('Error')) + RIGHT
  const WARN = LEFT + gold(y('Warn')) + RIGHT
  const INFO = LEFT + green(y('Info')) + RIGHT

  const id = Symbol('Application')
  Object.defineProperties(this, {
    i: { value: id },
    pcraft: { value: pcraft }
  })
  apps[this.i] = server
  global.console.log = (...text) => log(PCRAFT, ...text)
  global.console.error = (...text) => error(PCRAFT, ERROR, ...text)
  global.console.warn = (...text) => warn(PCRAFT, WARN, ...text)
  global.console.info = (...text) => info(PCRAFT, INFO, ...text)
  createInterface(process.stdout).on('line', input => server.log(input))

  loadPlugin(
    Object
      .keys(dependencies)
      .filter(key => key.startsWith('pcraft-plugin-'))
      .map(key => dependencies[key]),
      this
  ).then(pkg => {
    server.onDisable = () => Promise.all(Object.values(p => p.clear).filter(Boolean))
  })
  const app: Application = {
    y,
    pcraft,
    get bannedPlayers () { return null },
    banIp (address: string) { server.banIp(address) },
    unBanIp (address: string) { server.unBanIp(address) },
    broadcast (msg: string, permission?: string) {
      if (performance) server.broadcast(msg, permission)
      else server.broadcastMessage(msg)
    },
    emit (event: any, callback: () => void) {
      console.log(event)
      callback()
    },
    disable () {}
  }
  return app
}
