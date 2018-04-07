import * as PrettyError from 'pretty-error'
import * as ParsedError from 'pretty-error/lib/ParsedError'
import * as codeFrame from 'babel-code-frame'
import { readFileSync } from 'fs'

const EXP = / \u001b\[0m {2}\u001b\[0m\u001b\[90m(.+?):(\d+):(\d+)/g
const OPTS = { forceColor: true, linesBelow: 2, linesAbove: 1 }

PrettyError
  .start()
  .skipNodeFiles()
  .skipPackage('internal', 'ts-node', 'pcraft')
  .appendStyle({
    'pretty-error > header > title > kind': {
      color: 'bright-red',
      background: 'none'
    },
    'pretty-error > trace > item > header > pointer > file': {
      color: 'bright-cyan'
    },
    'pretty-error > trace > item > header > pointer > colon': {
      color: 'cyan'
    },
    'pretty-error > trace > item > header > pointer > line': {
      color: 'bright-cyan'
    },
    'pretty-error > trace > item > header > what': {
      color: 'bright-white'
    }
  })

const old = Error.prepareStackTrace
Error.prepareStackTrace = (e, trace) => {
  const text: string = old(e, trace)
  let match = EXP.exec(text)
  let result = ''
  const files = {}
  let i = 0
  let len = 0
  while (match && i < 3) {
    try {
      const file = files[match[1]] || (files[match[1]] = readFileSync(match[1]).toString())
      const loc = match.index + match[0].length
      result += text.slice(len, loc) + '\n\n' +
        codeFrame(file, +match[2], +match[3], OPTS)
      len = loc
      i++
    } catch (ignored) {}
    match = EXP.exec(text)
  }
  return '\n' + ((result && result + text.slice(len, text.length - 16)) || text) + '\n'
}
