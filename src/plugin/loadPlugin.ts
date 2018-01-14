import fs from 'fs-extra'
import _yargs from 'yargs/Yargs'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { Argv } from 'yargs'
import { resolve as resolvePath, join } from 'path'

import App from '../App'
import PackageInfo from './PackageInfo'
import Listener from '../event/Listener'
import Command from '../command/Command'
import Commander from '../command/Commander'
import CommandSender from '../type/CommandSender'
import Plugin, { IListener, ICommand } from './Plugin'

const yargs: (args?: string) => Argv = _yargs
const loadClass = (dir: string) => fs.readdir(dir)
  .then(files => Promise.all(
    files
      .filter(n => n.endsWith('.js'))
      .map(n => (n = join(dir, n)) && fs.stat(n).then(p => p.isFile() && import(n)))
  ))
  .then(p => p.filter(n => typeof n === 'function'))
export default (plugins: string[], app: App) => {
  plugins = [...new Set(plugins)]
  const { y: { __: _ }, pcraft } = app
  let len = plugins.length
  const pkgs: { [name: string]: Plugin } = {}
  let resolves = []
  let i = 0
  const lock = () => {
    if (++i === len) {
      resolves.forEach(fun => fun())
      resolves = []
    } else return new Promise(resolve => resolves.push(resolve))
  }
  const load = (name: string) => (async () => {
    let plugin: (register: Plugin, app?: App) => any
    if (typeof plugin !== 'function') {
      throw new TypeError(_('The plugin %s loaded failure!', name))
    }
    try {
      plugin = await import(name)
    } catch (e) {
      console.error(_('The plugin %s loaded failure!', name))
      throw e
    }
    const fn: Plugin = async (info: string | PackageInfo, dir?: string, options?: {}) => {
      let pkg: PackageInfo
      if (typeof info === 'string') {
        pkg = await fs.readJson(info)
      }
      if (pkg.name in pkgs) {
        throw new Error(_('The plugin %s already existed!', pkg.name))
      }
      if (pkg.pcraft !== pcraft) {
        throw new Error(_(
          'The version of Pcraft used by the plugin %s is wrong! (current: %s, need: %s)',
          pkg.name, pcraft, pkg.pcraft
        ))
      }
      if (!pkg.displayName) {
        pkg.displayName = upperFirst(camelCase(pkg.name.replace(/$pcraft-plugin-/, '')))
      }
      fn.pkg = pkg
      pkgs[pkg.name] = fn
      await lock()

      // 引入被继承的插件
      if (pkg.extends) {
        const deps = pkg
          .extends
          .map(p => 'pcraft-plugin-' + p)
          .filter(n => !pkgs[n])
        const needLoads = [...new Set(pkg.optionalExtends ? pkg
          .optionalExtends
          .map(p => 'pcraft-plugin-' + p)
          .filter(n => !pkgs[n])
          .concat(deps) : deps
        )]
        len += needLoads.length
        await Promise.all(needLoads.map(load))
        const noDeps = deps.filter(n => !pkgs[n])
        if (noDeps.length) {
          throw new Error(_('Dependencie(s) %s of the plugin %s loading failure!', noDeps.join(', '), pkg.name))
        }
      }

      if (dir) {
        dir = resolvePath(dir)
        if (await fs.pathExists(dir)) await fn.register(dir)
      }
    }
    fn.listeners = []
    fn.commands = {}
    fn.addListenerAll = (path: string) => loadClass(path)
      .then(c => (c = c.map(Li => fn.addListener(new Li(app, fn)))) && (() => c.forEach(f => f())))
    fn.addListener = (type: string | typeof Listener, listener?: IListener) => {
      let start = fn.listeners.length - 1
      if (listener instanceof Listener) {
        for (const f of Object.values(listener)) {
          if (typeof f === 'function' && f.eventName) {
            const fun: IListener = f.bind(fn)
            fun.type = f.evenType
            fn.listeners.push(fun)
          }
        }
      } else if (typeof type === 'string' && type) {
        listener.type = type
        fn.listeners.push(listener)
      } else {
        throw new Error('参数错误!')
      }
      const end = fn.listeners.length - 1
      return () => {
        while (start < end) fn.listeners[start++] = null
      }
    }
    fn.addCommanderAll = (path: string) => loadClass(path)
      .then(c => (c = c.map(co => co(fn.addCommander))) && (() => c.forEach(f => f())))
    fn.addCommander = (cmd: string, listener: typeof Commander | ((cmd: Command) => any)) => {
      if (!cmd || typeof cmd !== 'string') throw new TypeError('参数类型错误')
      const length = cmd.length
      if (listener instanceof Commander) {
        const Cmder = listener as typeof Commander
        const argv = yargs().locale('zh-CN')
        let commander = new Cmder(app, fn, argv)
        Object
          .values((argv as any).getCommandInstance().getCommandHandlers())
          .forEach(c => c.middlewares.push(v => obj))
        const obj = { $0: cmd, sender: null, text: null }
        fn.commands[cmd] = (sender: CommandSender, command: string) => {
          obj.sender = sender
          obj.text = command = command.substring(length).trim()
          argv.parse(command)
        }
        return () => {
          fn.commands[cmd] = null
          commander = null
        }
      } else if (typeof listener === 'function') {
        fn.commands[cmd] = (sender: CommandSender, command: string) => {
          const lis = listener as (cmd: Command) => any
          const text = command.substring(length).trim()
          lis(Object.assign(yargs(text).argv, { sender, text, $0: cmd }))
        }
        return () => { fn.commands[cmd] = null }
      } else throw new TypeError('参数错误!')
    }
    fn.register = async (dir: string) => {
      // 载入监听器
      const listenerPath = join(dir, 'listeners')
      if (await fs.pathExists(listenerPath)) await fn.addListenerAll(listenerPath)

      // 载入命令
      const commanderPath = join(dir, 'commands')
      if (await fs.pathExists(commanderPath)) await fn.addCommanderAll(commanderPath)
    }
    fn.onDisable = (fun: () => any) => (fn._onDisable = fun)
    fn.clear = () => ((fn.listeners = null), (fn.commands = null), fn._onDisable && fn._onDisable())
    await plugin(fn, app)
  })().catch(e => {
    delete pkgs[name]
    console.error(e)
  })
  return Promise.all(plugins.map(load)).then(() => pkgs)
}
