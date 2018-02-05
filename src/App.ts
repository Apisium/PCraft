import * as y18n from 'y18n'
import { join } from 'path'

import color from './colors'
import Y18n from './type/Y18n'
import Application from './Application'
import loadPlugin from './plugin/loadPlugin'

const { pcraft } = require('../package.json')
const { red, gold, green, gray } = color

const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')

const S = Symbol()
export default (
  { pkg: { locale = 'zh_CN', dependencies = {} }, server, helpers }) => {
  const y = y18n({ locale, directory: join(__dirname, '../locales') })
  const _ = y.__
  const ERROR = LEFT + red(_('Error')) + RIGHT
  const WARN = LEFT + gold(_('Warn')) + RIGHT
  const INFO = LEFT + green(_('Info')) + RIGHT

  const id = Symbol('Application')
  const sender = server.getConsoleSender()
  global.console.debug = console.log
  global.console.log =
    (...text) => { sender.sendMessage([PCRAFT, ...text].join(' ')) }
  global.console.error =
    (...text) => { sender.sendMessage([PCRAFT, ERROR, ...text].join(' ')) }
  global.console.warn =
    (...text) => { sender.sendMessage([PCRAFT, WARN, ...text].join(' ')) }
  global.console.info =
    (...text) => { sender.sendMessage([PCRAFT, INFO, ...text].join(' ')) }

  const result: any = {
    disable: cb => cb(),
    emit: (event, cb) => cb()
  }

  const app: Application = {
    y,
    pcraft,
    get bannedPlayers () { return null },
    banIp (address: string) { server.banIp(address) },
    unBanIp (address: string) { server.unBanIp(address) },
    broadcast (msg: string, permission?: string) {
      if (performance) server.broadcast(msg, permission)
      else server.broadcastMessage(msg)
    }
  }

  loadPlugin(
    Object
      .keys(dependencies)
      .filter(key => key.startsWith('pcraft-plugin-')),
    app
  )
    .then(plugins => {
      result.disable = cb => Promise
        .all(Object.values(p => p.clear).filter(Boolean))
        .catch(console.error)
        .then(cb)
      result.emit = (event, cb) => {
        console.info(event.getEventName())
        cb()
      }
    })
  return result
}
