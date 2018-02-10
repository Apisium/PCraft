import { parse } from 'css-selector-tokenizer'
import Application from '../Application'
import Player from '../entity/player/Player'
import PlayerList from './PlayerList'

export default (app: Application, invoke) =>
  function query (str: string | RegExp, list?: PlayerList): PlayerList {
    if (str instanceof RegExp) {
      const result: any = app.players.filter(p => str.test(p.name))
      result.query = (text: string) => query(text, result)
      return result
    }
    for (const node of parse(str).nodes) {
      const result = null
      for (const n of node) {
        switch (n.type) {
          case 'id': return invoke({ name: 'getPlayer', args: [n.name] })
        }
      }
    }
    return parse(str).nodes
  }
