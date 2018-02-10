import { parse } from 'css-selector-tokenizer'
import Application from '../Application'

export default (server: Application) => (str: string | RegExp) => {
  if (str instanceof RegExp) {
  }
  // parse(str).nodes
}
