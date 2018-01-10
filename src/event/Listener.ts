export default class Listener {
  public readonly app: any
  public readonly plugin: any
  public readonly config: any
  constructor (app: any, plugin: any) {
    this.app = app
    this.plugin = plugin
    this.config = app.config[plugin.name]
  }
}
