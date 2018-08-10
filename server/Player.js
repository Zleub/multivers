/* @flow */

import World, { world } from './World'
import { type FOV_t, computeFOV } from './FOV'
import Ressource from './Ressource'

export type PlayerOpt_t = {
  name: string,
  ip: string,
  position?: Array<number>
}

class Player extends Ressource {
  ip: string
  token: string

  fov: FOV_t
  constructor(world: World, opts : PlayerOpt_t) {
    super({
      name: opts.name,
      position: world.spawn,
      offset: [0, 0]
    })
    Object.assign(this, {
      fov: computeFOV( world.spawn )
    }, opts)
  }
}

export default Player
