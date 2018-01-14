import ServerOperator from './ServerOperator'

export default interface Permissible extends ServerOperator {
  hasPermission (): boolean
}
