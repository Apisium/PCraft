import color from './colors'

const { aqua, gray, red, gold, green } = color
const LEFT = gray('[')
const MID = gray('|')
const RIGHT = gray(']:')
const ERROR = MID + red('错误') + RIGHT
const WARN = MID + gold('警告') + RIGHT
const INFO = MID + green('信息') + RIGHT

export default (name: string) => ({
  log: LEFT + aqua(name) + RIGHT,
  error: LEFT + aqua(name) + ERROR,
  warn: LEFT + aqua(name) + WARN,
  info: LEFT + aqua(name) + INFO
})
