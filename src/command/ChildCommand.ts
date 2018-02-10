import { COMMANDS } from '../symbols'

export default (
  name: string | string[],
  description: string,
  handler?: any
): any => (target, key, descriptor) => {
  (target[COMMANDS] || (target[COMMANDS] = []))
    .push([name, description, descriptor.value, handler])
  descriptor.value[COMMANDS] = name
  return descriptor
}
