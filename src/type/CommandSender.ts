import Permissible from '../permission/Permissible'

export default interface CommandSender extends Permissible {
  name: string
  send (...msg: string[])
}
