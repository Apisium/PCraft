import Event from './Event'

export default (event: { eventName: string } | string, level: number = 5): any => (target: any) => {
  target.eventType = typeof event === 'string' ? event : event.eventName
  target.eventLevel = level
}
