/* @flow */

import Drawable, {config, type Drawable_t} from './Drawable'
import Player from './Player'
import Map from './Map'
import Ressource from './Ressource'
import Wiki from './Wiki'

export const addPlayer = function (world : World, player : Player) {
  Wiki.events.push({
    timestamp: Date.now(),
    event: `A new player arise. [${player.name} @ ${player.position[0]}, ${player.position[1]}]`
  })
  world.players.push(player)
}

class World {
  players: Array<Player>
  spawn: Array<number>
  map: Map
  tiles: {
    [tile_name: string]: Drawable_t
  }

  constructor() {
    let map = new Map()

    Object.assign(this, {
      players : [],
      spawn : [Math.floor(map.limits.width / 2), Math.floor(map.limits.depth / 2)],
      map : map,
      tiles : config.reduce( (p,e) => {
          p[e.name] = e
          return p
        }, {})
    })
  }
}

export default World
export const world = new World()
