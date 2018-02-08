import { Argv } from 'yargs'
import CommandSender from '../type/CommandSender'

export interface Args extends Argv {
  readonly sender: CommandSender
  readonly text: string
  readonly clias: string
}
export default Args
