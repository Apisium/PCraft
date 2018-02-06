const colors = {
  black: '0',
  blueDark: '1',
  greenDark: '2',
  aquaDark: '3',
  redDark: '4',
  purpleDark: '5',
  gold: '6',
  gray: '7',
  grayDark: '8',
  blue: '9',
  green: 'a',
  aqua: 'b',
  red: 'c',
  purple: 'd',
  yellow: 'e',
  white: 'f'
}
const styles = {
  random: 'k',
  bold: 'l',
  strikethrough: 'm',
  underline: 'n',
  italic: 'o',
  reset: 'r'
}

export interface StyleFuns<T> {
  black?: T
  blueDark?: T
  greenDark?: T
  aquaDark?: T
  redDark?: T
  purpleDark?: T
  gold?: T
  gray?: T
  grayDark?: T
  blue?: T
  green?: T
  aqua?: T
  red?: T
  purple?: T
  yellow?: T
  white?: T
  random?: T,
  bold?: T,
  strikethrough?: T,
  underline?: T,
  italic?: T,
  reset?: T
}

export interface StyledText extends StyleFuns<StyledText> {
  (...text: string[]): string
  color?: string
  styles?: string[]
}

const set = () => { throw new Error('Cannot define! ') }
const create = (c: string, s?: string): StyledText => {
  const props = {}
  const obj: StyledText = (...text: string[]) =>
    (obj.color ? '§' + colors[obj.color] : '') +
    (obj.styles.length ? '§' + obj.styles.map(t => styles[t]).join('§') : '') +
    text.join(' ') + '§r'
  obj.color = c || ''
  obj.styles = s ? [s] : []
  for (const key in colors) props[key] = { get: () => ((obj.color = key), obj), set }
  for (const key in styles) props[key] = { get: () => (obj.styles.push(key), obj), set }
  return Object.defineProperties(obj, props)
}

const regexp = /#+{\s*([\s\S]+?)}/g
const raw = (str: string | TemplateStringsArray, ...args: any[]): string => {
  if (typeof str !== 'string') str = String.raw(str, ...args)
  return str.replace(regexp, (a, b: string) => {
    if (a.startsWith('##')) return a
    const [styleStr, ...strs] = b.split(' ')
    const style = styleStr.split('.')
    const result = style.map(s => styles[s]).filter(Boolean)
    const color = style.reverse().find(s => !!colors[s])
    if (color) result.unshift(colors[color])
    const text = strs.join(' ')
    return result.length ? '§' + result.join('§') + text + '§r' : text
  })
}

export interface Exported extends StyleFuns<StyledText> {
  (str: string | TemplateStringsArray, ...args: any[]): string
}
const props2 = {}
for (const key in colors) props2[key] = { get: () => create(key), set }
for (const key in styles) props2[key] = { get: () => create(null, key), set }
export default Object.defineProperties(raw, props2) as Exported
