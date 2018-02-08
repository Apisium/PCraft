import * as fs from 'fs'
import { join } from 'path'

const events = {}
const root = join(__dirname, 'event')
for (let dir of fs.readdirSync(root)) {
  dir = join(root, dir)
  if (fs.statSync(dir).isDirectory()) {
    for (const fileName of fs.readdirSync(dir)) {
      const file = join(dir, fileName)
      if (file.endsWith('.js') && fs.statSync(file).isFile()) {
        const fn = require(file)
        if (fn && fn.define) events[fileName.substring(0, fileName.length - 3)] = fn.define
      }
    }
  }
}

export default events
