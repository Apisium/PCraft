import Listener from './event/Listener'
import EventHandler from './event/EventHandler'
import PlayerJoinEvent from './event/player/PlayerJoinEvent'
import c from './colors'

// console.log(
//   c.red.bold('bold'),
//   c.green('www'),
//   c`default #{ grey.random haha } #{ blue ${233} }`
// )

export default class MyListener extends Listener {
  @EventHandler(PlayerJoinEvent)
  public onPlayerJoin (e: PlayerJoinEvent) {
    e.player.send('Hello:', e.player.name + '!')
  }
}
