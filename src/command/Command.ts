import Commander from './Commander'

export default (name: string, description?: string, alias?: string[]): any => Clazz => {
  name = name.trim().toLowerCase()
  const frezeed = Array.isArray(alias) ? Object.freeze([...new Set(alias)]) : null
  const props = {
    commandName: { value: name },
    commandDescription: { value: description },
    commandAlias: { value: frezeed }
  }
  Object.defineProperties(Clazz, props)
  Object.defineProperties(Clazz.prototype, props)
}
