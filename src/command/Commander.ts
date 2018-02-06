import { Argv } from 'yargs'
import Application from '../Application'
import Plugin from '../plugin/Plugin'

export default class Commander<T = any> {
  public readonly app: Application
  public readonly plugin: Plugin
  public readonly config: T
  public readonly yargs: Argv
  constructor (app: Application, plugin: Plugin, yargs: Argv) {
    this.app = app
    this.plugin = plugin
    this.config = plugin.config
    this.yargs = yargs
  }
}
