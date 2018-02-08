import { Args } from './Args'
import Application from '../Application'
import Plugin from '../plugin/Plugin'

export default class Commander<T = any> {
  public readonly app: Application
  public readonly plugin: Plugin
  public readonly config: T
  public readonly yargs: Args
  public readonly commandName: string
  public readonly commandDescription: string
  public readonly commandAlias: string[]
  constructor (app: Application, plugin: Plugin, yargs: Args) {
    this.app = app
    this.plugin = plugin
    this.config = plugin.config
    this.yargs = yargs
  }
}
