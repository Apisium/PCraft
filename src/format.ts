import * as parse from 'ansi-style-parser'
import colors from './colors'
import { inspect } from 'util'

const map = {
  black: 'black',
  red: 'redDark',
  green: 'greenDark',
  yellow: 'gold',
  blue: 'blueDark',
  magenta: 'purpleDark',
  lightMagenta: 'purple',
  cyan: 'aquaDark',
  white: 'gray',
  lightWhite: 'white',
  gray: 'grayDark',
  lightRed: 'red',
  lightGreen: 'green',
  lightYellow: 'yellow',
  lightBlue: 'blue',
  lightCyan: 'aqua',
  hidden: 'random'
}
export default (text: any[]) => parse(text.map(d => {
  const t = typeof d
  return t === 'object' || t === 'function' ? d.stack ? d.stack : inspect(d, false, 2, true)
    : t === 'undefined' ? 'undefined' : d
}).join(' ')).map(e =>
  e.styles.length
  ? e.styles.reduce((prev, color) => prev[map[color]] || prev, colors)(e.text)
  : e.text
).join('')
