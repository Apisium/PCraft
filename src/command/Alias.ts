import { Options } from 'yargs'
import { ALIAS, COMMANDS } from '../symbols'

export default (
  alias: string,
  name?: string
): any => (target, key, descriptor) => {
  if (!descriptor && !name) {
    throw new TypeError('Alias name is null!')
  }
  if (descriptor && typeof descriptor[COMMANDS] === 'string') {
    name = descriptor[COMMANDS]
  } else {
    throw new Error('Command name is null!')
  }
  (target[ALIAS] || (target[ALIAS] = [])).push([alias, name])
  return descriptor
}
