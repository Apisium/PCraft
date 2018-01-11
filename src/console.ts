import { Console } from 'console'
import info from './info'

export default (name: string) => {
  const i = info(name)
  return {
    ...console,
    log: (...text) => console.log(i.log, ...text),
    error: (...text) => console.log(i.error, ...text),
    warn: (...text) => console.log(i.log, ...text),
    info: (...text) => console.log(i.info, ...text)
  }
}
