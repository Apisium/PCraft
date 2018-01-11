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

interface StyledText {
  (...text: string[]): string
  color?: string
  styles?: string[]
  black?: StyledText
  blueDark?: StyledText
  greenDark?: StyledText
  aquaDark?: StyledText
  redDark?: StyledText
  purpleDark?: StyledText
  gold?: StyledText
  gray?: StyledText
  grayDark?: StyledText
  blue?: StyledText
  green?: StyledText
  aqua?: StyledText
  red?: StyledText
  purple?: StyledText
  yellow?: StyledText
  white?: StyledText
  random?: StyledText,
  bold?: StyledText,
  strikethrough?: StyledText,
  underline?: StyledText,
  italic?: StyledText,
  reset?: StyledText
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

const props2 = {}
for (const key in colors) props2[key] = { get: () => create(key), set }
for (const key in styles) props2[key] = { get: () => create(null, key), set }
export default Object.defineProperties({}, props2) as StyledText
