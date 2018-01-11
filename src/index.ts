import Listener from './event/Listener'
import EventHandler from './event/EventHandler'
import PlayerJoinEvent from './event/player/PlayerJoinEvent'
import c from './colors'

console.log(c.blue.bold('hhh', 'yyy'), 'hyyy')

// export default class MyListener extends Listener {
//   @EventHandler(PlayerJoinEvent)
//   public onPlayerJoin (e: PlayerJoinEvent) {
//     e.player.send('Hello:', e.player.name + '!')
//   }
// }
