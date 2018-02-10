import { Options } from 'yargs'
import { OPTIONS } from '../symbols'

export default (
  name: string,
  option?: Options
): any => (target, key, descriptor) => {
  (target[OPTIONS] || (target[OPTIONS] = [])).push([name, option])
  return descriptor
}
