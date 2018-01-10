import Entity from './Entity'
import Damageable from './Damageable'
import GameMode from '../enum/GameMode'

export default interface HumanEntity extends Entity, Damageable {
  isHandRaised: boolean // readonly
  sleepTicks: number // readonly
  expToLevel: number // readonly
  inventory: PlayerInventory // readonly
  mainHand: MainHand // readonly
  name: string // readonly
  isBlocking: boolean // readonly
  enderChest: Inventory // readonly
  isSleeping: boolean // readonly
  gameMode: GameMode
  itemOnCursor: ItemStack
  hasCooldown (material): boolean
  openInventory (inventory): void
  openInventoryTop (inventory): InventoryView
  openInventoryLocation (location: Location, force?: boolean): InventoryView // readonly
  closeInventory (): void
  getCooldown (material): number
}
