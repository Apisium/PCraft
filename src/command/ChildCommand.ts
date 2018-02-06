import Commander from './Commander'

export default (
  name: string | string[],
  description: string,
  handler?: any
): any => (target: Commander, key, descriptor) => {
  target.yargs.command(name, description, descriptor.value.bind(target), handler)
  return descriptor
}
