import Event from './Event'

export default (event: string, level: number = 5): any => (target, key, descriptor) => {
  const method = descriptor.value
  method.eventType = event
  method.eventLevel = level
  ;(target.handlers || (target.handlers = [])).push(method)
  return descriptor
}
