import World from './World'

export default interface Location {
  world: World
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
}
