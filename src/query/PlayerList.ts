import Player from '../entity/player/Player'

export default interface PlayerList extends Player, Array<Player> {
  query (str: string): PlayerList
}
