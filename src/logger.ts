import color from './colors'

const { aqua, gray, red, gold, green } = color
const LEFT = gray('[')
const MID = gray('|')
const RIGHT = gray(']:')

export default (_, name: string) => {
  const ERROR = MID + red(_('Error')) + RIGHT
  const WARN = MID + gold(_('Warn')) + RIGHT
  const INFO = MID + green(_('Info')) + RIGHT
  return {
    log: LEFT + aqua(name) + RIGHT,
    error: LEFT + aqua(name) + ERROR,
    warn: LEFT + aqua(name) + WARN,
    info: LEFT + aqua(name) + INFO
  }
}
