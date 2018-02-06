import Event from './Event'
import Listener from './Listener'

export default (event: string, level: number = 5): any =>
  (target: Listener, key, descriptor) => {
    const method = descriptor.value.bind(target)
    method.eventType = event
    method.eventLevel = level
    ;(target.handlers || (target.handlers = [])).push(method)
    return descriptor
  }
