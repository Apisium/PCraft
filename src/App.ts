import * as y18n from 'y18n'
import { join } from 'path'

import color from './colors'
import format from './format'
import Y18n from './type/Y18n'
import eventProxy from './eventProxy'
import Application from './Application'
import loadPlugin from './plugin/loadPlugin'
import * as freeze from 'deep-freeze-node'
import { define as definePlayer, checkType } from './entity/player/Player'
import { define as defineCommandSender } from './type/CommandSender'

const { pcraft } = require('../package.json')
const { red, gold, green, gray } = color

const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')

export default ({
  pkg: { config, dependencies = {} },
  server,
  helpers,
  register,
  addCommand
}) => {
  config.locale = config.locale || 'zh_CN'
  const y = y18n({ locale: config.locale, directory: join(__dirname, '../locales') })
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
    disable: () => {},
    emit: (event, cb) => () => {}
  }

  freeze(config)
  const app: Application = {
    y,
    pcraft,
    config,
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
      let allEvent = new Set()
      let cmds = []
      let registerCmds = []
      plugins.forEach(p => {
        p.listeners.forEach(l => allEvent.add(l.eventType))
        p.commands.reverse().forEach(c => {
          const name = c.commandName
          if (cmds.includes(name)) {
            console.warn(
              _('The command §e/%s§r of the plugin %s has already existed!', name, p.name))
            return
          }
          cmds.push(name)
          registerCmds.push([(cmder, alias, args) => {
            try {
              cmder = cmder.get()
              c(
                checkType(cmder) ? definePlayer(cmder) : defineCommandSender(cmder),
                args,
                alias
              )
            } catch (e) {
              console.error(e)
            }
          }, name, c.commandDescription, c.commandAlias])
          console.info(_('The command §e/%s§r registration success!', name))
        })
      })

      result.disable = () => Promise
        .all(Object.values(p => p.clear).filter(Boolean))
        .catch(console.error)
      result.emit = event => {
        event = event.get()
        let type: string = event.getEventName()
        if (eventProxy[type]) event = eventProxy[type](event)
        type = type.substring(0, type.length - 5)
        event.type = type
        Promise.all(plugins.map(p => {
          const listeners = p.listeners.filter(l => l.eventType === type)
          return listeners.length && Promise.all(listeners.map(l => l(event)))
        }).filter(Boolean)).catch(console.error)
      }

      cmds = null
      register(...allEvent)
      allEvent = null
      registerCmds.forEach(args => addCommand(...args))
      registerCmds = null
    })
  return result
}
