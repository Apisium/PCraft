import Event from './Event'

export default (event: typeof Event, level: number = 5): any => (target: any) => {
  target.eventType = event.eventName
  target.eventLevel = level
}
