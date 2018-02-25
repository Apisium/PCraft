import * as y18n from 'y18n'
import * as freeze from 'deep-freeze-node'
import { join } from 'path'

import color from './colors'
import format from './format'
import Y18n from './type/Y18n'
import eventProxy from './eventProxy'
import Application from './Application'
import loadPlugin from './plugin/loadPlugin'
import { APPLICATION } from './symbols'
import { define as definePlayer, checkType } from './entity/player/Player'
import { define as defineCommandSender } from './type/CommandSender'

const { pcraft } = require('../package.json')
const { red, gold, green, gray, aqua } = color

const PCRAFT = gray('Pcraft:')
const LEFT = gray('Pcraft: [')
const MID = gray(' |')
const RIGHT = gray(']')

export default ({
  pkg: { config, dependencies = {} },
  server,
  invoke,
  helpers,
  registerEvent,
  registerCommand
}) => {
  config.locale = config.locale || 'zh_CN'
  const y = y18n({ locale: config.locale, directory: join(__dirname, '../locales') })
  const _ = y.__
  const ERROR = LEFT + red(_('Error')) + RIGHT
  const WARN = LEFT + gold(_('Warn')) + RIGHT
  const INFO = LEFT + green(_('Info')) + RIGHT
  const ERROR2 = LEFT + red(_('Error')) + MID
  const WARN2 = LEFT + gold(_('Warn')) + MID
  const INFO2 = LEFT + green(_('Info')) + MID

  const id = Symbol('Application')
  const sender = server.getConsoleSender()
  Object.assign(global.console, {
    debug: console.log,
    log (...text) { sender.sendMessage(format([PCRAFT, ...text])) },
    error (...text) { sender.sendMessage(format([ERROR, ...text])) },
    warn (...text) { sender.sendMessage(format([WARN, ...text])) },
    info (...text) { sender.sendMessage(format([INFO, ...text])) }
  })

  if (helpers) {
    const fns: any = {}
    if (typeof helpers.setTimeout === 'function') {
      fns.setTimeout = (fn, time = 0, ...args) => typeof fn === 'function' &&
        helpers.setTimeout(() => fn.apply(null, args), time | 0)
    }
    if (typeof helpers.clearTimeout === 'function') {
      fns.clearTimeout = i => i && helpers.clearTimeout(i | 0)
    }
    Object.assign(global, fns)
  }

  const result: any = {
    disable: () => {},
    emit: (event, cb) => () => {}
  }

  const app: Application = global[APPLICATION] = freeze(Object.defineProperties({
    pcraft,
    config,
    banIp (address: string) { server.banIp(address) },
    unBanIp (address: string) { server.unBanIp(address) },
    broadcast (msg: string, permission?: string) {
      if (performance) server.broadcast(msg, permission)
      else server.broadcastMessage(msg)
    },
    getLogger (name) {
      const t = aqua(name) + RIGHT
      const t2 = LEFT + t
      return {
        ...console,
        log (...text) { sender.sendMessage(format([t2, ...text])) },
        error (...text) { sender.sendMessage(format([ERROR2, t, ...text])) },
        warn (...text) { sender.sendMessage(format([WARN2, t, ...text])) },
        info (...text) { sender.sendMessage(format([INFO2, t, ...text])) }
      }
    }
  }, {
    y: { value: y },
    bannedPlayers: { get: () => null },
    players: { get: () =>
      invoke({ name: 'getOnlinePlayers' }, { name: 'toArray' }).map(p => definePlayer(p)) }
  }))

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
          registerCmds.push([(cmder, args, alias) => {
            try {
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

      // result.disable = () => Promise
      //   .all(Object.values(p => p.clear).filter(Boolean))
      //   .catch(console.error)
      result.emit = event => {
        let type: string = event.getEventName()
        const i = type.lastIndexOf('.')
        if (~i) type = type.substring(i + 1)
        if (eventProxy[type]) event = eventProxy[type](event)
        type = type.substring(0, type.length - 5)
        event.type = type
        Promise.all(plugins.map(p => {
          const listeners = p.listeners.filter(l => l.eventType === type)
          return listeners.length && Promise.all(listeners.map(l => l(event)))
        }).filter(Boolean)).catch(console.error)
      }

      cmds = null
      registerEvent(...allEvent)
      allEvent = null
      registerCmds.forEach(args => registerCommand(...args))
      registerCmds = null
    })
    .catch(console.error)
  return result
}
