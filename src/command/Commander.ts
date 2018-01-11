import { Argv } from 'yargs'

export default class Commander {
  public readonly app: any
  public readonly plugin: any
  public readonly config: any
  constructor (app: any, plugin: any, yargs: Argv) {
    this.app = app
    this.plugin = plugin
    this.config = app.config[plugin.name]
  }
}
