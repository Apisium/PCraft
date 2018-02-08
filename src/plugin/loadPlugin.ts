import * as fs from 'fs-extra'
import * as yargs from 'yargs/Yargs'
import * as freeze from 'deep-freeze-node'
import { camelCase, upperFirst } from 'lodash'
import { resolve as resolvePath, join } from 'path'

import format from '../format'
import Application from '../Application'
import PackageInfo from './PackageInfo'
import Listener from '../event/Listener'
import Args from '../command/Args'
import Commander from '../command/Commander'
import CommandSender from '../type/CommandSender'
import Plugin, { IListener, ICommand } from './Plugin'

const loadClass = (dir: string) => fs.readdir(dir)
  .then(files => Promise.all(
    files
      .filter(n => n.endsWith('.js'))
      .map(n => (n = join(dir, n)) && fs.stat(n).then(p => p.isFile() && import(n)))
  ))
  .then(p => p.map(n => n && n.default ? n.default : n)
    .filter(n => typeof n === 'function'))

const createArgv = (cmd: string, locale: string, version: string) => {
  const argv = Object.assign(yargs()
    .locale(locale)
    .help('help').alias('help', 'h')
    .version(version).alias('version', 'v')
    .exitProcess(false),
    {
      $0: cmd,
      text: null,
      clias: null,
      sender: null,
      exit: () => {},
      exitProcess: () => {},
      dispatchCmd (text: string) {
        Promise.resolve(argv.parse(text)).then(() => {
          argv.text = null
          argv.clias = null
          argv.sender = null
        })
      }
    }
  )
  const logger = argv._getLoggerInstance()
  logger.error = logger.log = (...args) => argv.sender
    ? argv.sender.send
      ? argv.sender.send(...args)
      : argv.sender.sendMessage && argv.sender.sendMessage(format(args))
    : console.log(...args)
  return argv
}

export default (plugins: string[], app: Application) => {
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
    console.info(_('The plugin §e%s§r is loading!', name))

    let plugin: any
    try {
      plugin = await import(name)
      if (plugin.default) plugin = plugin.default
    } catch (e) {
      console.error(_('The plugin §e%s§r loaded failure!', name))
      throw e
    }
    if (typeof plugin !== 'function') {
      throw new TypeError(_('The plugin §e%s§r loaded failure!', name))
    }
    const fn: Plugin = async (info: string | PackageInfo, dir?: string, options?: {}) => {
      let pkg: PackageInfo
      if (typeof info === 'string') {
        pkg = await fs.readJson(info)
      }
      if (pkg.name in pkgs) {
        throw new Error(_('The plugin §e%s§r already existed!', pkg.name))
      }
      if (pkg.pcraft !== pcraft) {
        throw new Error(_(
          'The version of Pcraft used by the plugin §e%s§r is wrong! (current: %s, need: %s)',
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
          throw new Error(_(
            'Dependencie(s) %s of the plugin §e%s§r loading failure!',
            noDeps.join(', '),
            pkg.name
          ))
        }
      }

      freeze(pkg)

      if (dir) {
        dir = resolvePath(dir)
        if (await fs.pathExists(dir)) await fn.register(dir)
      }
    }

    fn.listeners = []
    fn.commands = []

    fn.addListenerAll = (path: string) => loadClass(path)
      .then(c => (c = c.map(Li => fn.addListener(new Li(app, fn)))) &&
      (() => c.forEach(f => f())))

    fn.addListener = (type: string | typeof Listener, listener?: IListener) => {
      let start = fn.listeners.length - 1
      if (type instanceof Listener) {
        fn.listeners = fn.listeners.concat(type.handlers.filter(f => f.eventType))
        Object.freeze(type.handlers)
      } else if (typeof type === 'string' && type) {
        listener.eventType = type
        fn.listeners.push(listener)
      } else {
        throw new Error(_('Parameter error!'))
      }
      const end = fn.listeners.length - 1
      return () => {
        while (start < end) fn.listeners[start++] = null
      }
    }

    fn.addCommanderAll = (path: string) => loadClass(path)
      .then(c => (c = c.map(co => fn.addCommander(
        co.commandName,
        co,
        co.commandDescription,
        co.commandDescription
      ))) && (() => c.forEach(f => f())))

    fn.addCommander = (
      cmd: string,
      listener: typeof Commander | ((cmd: Args) => any),
      description?: string,
      alias?: string[]
    ) => {
      if (!cmd || typeof cmd !== 'string') throw new TypeError('命令名为空!')
      cmd = cmd.trim().toLowerCase()
      const freezed = Array.isArray(alias) ? Object.freeze([...new Set(alias)]) : null
      try {
        const Cmder = listener as typeof Commander
        const argv = createArgv(cmd, app.config.locale, fn.pkg.version)
        let commander = new Cmder(app, fn, argv)
        if (!(commander instanceof Commander)) throw new Error('')
        let caller: ICommand = (
          sender: CommandSender,
          command: string,
          curClias: string = cmd
        ) => {
          command = command.trim()
          argv.sender = sender
          argv.clias = curClias
          argv.text = curClias + ' ' + command
          argv.dispatchCmd(command)
        }
        caller.commandName = cmd
        caller.commandDescription = description
        ;(caller as any).commandAlias = freezed
        const id = fn.commands.push(caller) - 1
        return () => {
          fn.commands[id] = null
          commander = null
          caller = null
        }
      } catch (e) {
        if (typeof listener === 'function') {
          const argv = createArgv(cmd, app.config.locale, fn.pkg.version)
          let caller: ICommand = (
            sender: CommandSender,
            command: string,
            curClias: string = cmd
          ) => {
            command = command.trim()
            argv.sender = sender
            argv.clias = curClias
            argv.text = curClias + ' ' + command
            argv.dispatchCmd(command)
          }
          const lis = listener as (cmd: Args) => any
          lis(argv)
          caller.commandName = cmd
          caller.commandDescription = description
          ;(caller as any).commandAlias = freezed
          const id = fn.commands.push(caller) - 1
          return () => {
            fn.commands[id] = null
            caller = null
          }
        } else throw new TypeError(_('Parameter error!'))
      }
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

    fn.clear = () => ((fn.listeners = null), (fn.commands = null),
      fn._onDisable && fn._onDisable())

    await plugin(fn, app)
    Object.freeze(fn.listeners)
    Object.freeze(fn.command)
    Object.freeze(fn)

    console.info(_('The plugin §e%s§r is loaded!', name))
  })().catch(e => {
    delete pkgs[name]
    console.error(e)
  })
  return Promise.all(plugins.map(load)).then(() => pkgs)
}
