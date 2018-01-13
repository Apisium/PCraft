import y18n from 'y18n'
import { join } from 'path'
import { createInterface } from 'readline'

import color from './colors'
import Y18n from './type/Y18n'
import loadPlugin from './plugin/loadPlugin'

const { pcraft } = require('../package.json')
const { error, warn, info, log } = console
const { red, gold, green, gray } = color

const apps = {}
const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')

const S = Symbol()
export default class Application {
  public readonly pcraft: number
  public readonly y: Y18n = y18n({ locale: 'zh_CN', directory: join(__dirname, '../locales') })
  private i: symbol
  constructor (server: any, plugins: string[]) {
    const y = this.y.__
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

    loadPlugin(plugins, this)
  }
  public banIp (address: string) { apps[this.i].banIp(address) }
  public unBanIp (address: string) { apps[this.i].unBanIp(address) }
  public broadcast (msg: string, permission?: string) {
    if (performance) apps[this.i].broadcast(msg, permission)
    else apps[this.i].broadcastMessage(msg)
  }
  public get bannedPlayers () { return null }
}
