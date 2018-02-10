import { Argv } from 'yargs'
import CommandSender from '../type/CommandSender'

export interface Args extends Argv {
  readonly sender: CommandSender
  readonly text: string
  readonly curAlias: string
  readonly [key: string]: any
}
export default Args
