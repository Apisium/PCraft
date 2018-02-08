import ServerOperator, { define as define1 } from './ServerOperator'

export default interface Permissible extends ServerOperator {
  hasPermission (): boolean
}
export const define = define1
