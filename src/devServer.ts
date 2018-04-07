import * as WebSocket from 'ws'
import { pathExists } from 'fs-extra'
import Application from './Application'

const purgeCache = (path: string) => {
  const mod = require.cache[path]
  if (mod) {
    (function traverse (mod1) {
      mod1.children.forEach(traverse)
      delete require.cache[path]
    }(mod))
  }
}

interface ReloadData {
  name: string
  path: string
}
interface Data {
  type: 'reload' | 'command',
  data: string | ReloadData
}
export default (app: Application) => {
  const server = new WebSocket.Server({ port: 4679 }).on('connection', conn => {
    conn.on('message', async msg => {
      const { type, data }: Data = JSON.parse(msg.toString())
      switch (type) {
        case 'reload':
          const { name, path } = data as ReloadData
          if (!(await pathExists(path))) return
          purgeCache(path)
          server.emit('reload', name, path)
      }
    })
  })
  return server
}
