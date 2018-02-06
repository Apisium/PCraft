export default (name: string): any => (target, key, descriptor) => {
  descriptor.value.commandMame = name
  return descriptor
}
