import * as y18n from 'y18n'
import { join } from 'path'

import color from './colors'
import Y18n from './type/Y18n'
import Application from './Application'
import loadPlugin from './plugin/loadPlugin'
import { inspect } from 'util'

const { pcraft } = require('../package.json')
const { red, gold, green, gray } = color

const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')

const format = (text: string[]) => text.map(d => {
  const t = typeof d
  return t === 'object' || t === 'function' ? inspect(d)
    : t === 'undefined' ? 'undefined' : d
}).join(' ')

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
    (...text) => { sender.sendMessage(format([PCRAFT, ...text])) }
  global.console.error =
    (...text) => { sender.sendMessage(format([PCRAFT, ERROR, ...text])) }
  global.console.warn =
    (...text) => { sender.sendMessage(format([PCRAFT, WARN, ...text])) }
  global.console.info =
    (...text) => { sender.sendMessage(format([PCRAFT, INFO, ...text])) }

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
    .then(pkgs => {
      const plugins = Object.values(pkgs)
      result.disable = cb => Promise
        .all(Object.values(p => p.clear).filter(Boolean))
        .catch(console.error)
      result.emit = (event, cb) => {
        let type: string = event.getEventName()
        type = type.substring(0, type.length - 5)
        Promise.all(plugins.map(p => {
          const listeners = p.listeners.filter(l => l.eventType === type)
          return listeners.length && Promise.all(listeners.map(l => l(event)))
        }).filter(Boolean)).catch(console.error)
      }
    })
  return result
}
