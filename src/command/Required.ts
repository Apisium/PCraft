import { Options } from 'yargs'
import { OPTIONS, APPLICATION } from '../symbols'

export default (
  name: string,
  option?: Options
): any => (target, key, descriptor) => {
  (target[OPTIONS] || (target[OPTIONS] = [])).push([name, option])
  const method = descriptor.value
  descriptor.value = function (...args) {
    const argv = args[0]
    if (argv && !argv.argv[name]) {
      argv.sender.send(global[APPLICATION].y
        .__('Missing necessary parameters: §e--%s§r', name))
    } else return method.apply(this, args)
  }
  return descriptor
}
