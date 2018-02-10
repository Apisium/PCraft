import { Options } from 'yargs'
import { USAGES } from '../symbols'

export default (
  name: string,
  description?: string,
  builder?: any,
  handler?: any
): any => (target, key, descriptor) => {
  (target[USAGES] || (target[USAGES] = [])).push([name, description, builder, handler])
  return descriptor
}
