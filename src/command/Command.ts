import { Arguments } from 'yargs'
import CommandSender from '../type/CommandSender'

export default interface Command extends Arguments {
  sender: CommandSender
  text: string
}
