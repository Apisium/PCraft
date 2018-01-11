import color from './colors'
import { createInterface } from 'readline'

const { error, warn, info, log } = console
const { red, gold, green, gray } = color

const apps = {}
const plugins = {}
const PCRAFT = gray('Pcraft:')
const LEFT = gray('[')
const RIGHT = gray(']')
const ERROR = LEFT + red('错误') + RIGHT
const WARN = LEFT + gold('警告') + RIGHT
const INFO = LEFT + green('信息') + RIGHT

const S = Symbol()
export default class Application {
  private i: symbol
  constructor (server: any, dependencies: string[]) {
    const id = Symbol('Application')
    Object.defineProperty(this, 'i', { value: id })
    apps[this.i] = server
    plugins[this.i] = {}
    global.console.log = (...text) => log(PCRAFT, ...text)
    global.console.error = (...text) => error(PCRAFT, ERROR, ...text)
    global.console.warn = (...text) => warn(PCRAFT, WARN, ...text)
    global.console.info = (...text) => info(PCRAFT, INFO, ...text)
    createInterface(process.stdout).on('line', input => server.log(input))
  }
  public banIp (address: string) { apps[this.i].banIp(address) }
  public unBanIp (address: string) { apps[this.i].unBanIp(address) }
  public broadcast (msg: string, permission?: string) {
    if (performance) apps[this.i].broadcast(msg, permission)
    else apps[this.i].broadcastMessage(msg)
  }
  public get bannedPlayers () { return null }
}
