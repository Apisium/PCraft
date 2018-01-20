import { Arguments } from 'yargs'
import CommandSender from '../type/CommandSender'

export default interface Args extends Arguments {
  sender: CommandSender
  text: string
}
