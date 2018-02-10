import { Options } from 'yargs'
import { EXAMPLES } from '../symbols'

export default (
  name: string,
  description: string
): any => (target, key, descriptor) => {
  (target[EXAMPLES] || (target[EXAMPLES] = [])).push([name, description])
  return descriptor
}
