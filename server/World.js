/* @flow */

import Drawable, {config, type Drawable_t} from './Drawable'
import Player from './Player'
import Ressource from './Ressource'
import Wiki from './Wiki'

export const addPlayer = function (world : World, player : Player) {
  Wiki.events.push({
    timestamp: Date.now(),
    event: `A new player arise. [${player.name} @ ${player.position[0]}, ${player.position[1]}]`
  })
  world.players.push(player)
}

const size = 32
class World {
  limits: {
    width: number,
    height: number
  }
  players: Array<Player>
  spawn: Array<number>
  map: Array<{
    name: string,
    index: number
  }>
  tiles: {
    [tile_name: string]: Drawable_t
  }

  constructor() {
    Object.assign(this, {
      limits: {
        width: size,
        height: size
      },
      players : [],
      spawn : [Math.floor(size / 2), Math.floor(size / 2)],
      map : [],
      tiles : config.reduce( (p,e) => {
          p[e.name] = e
          return p
        }, {})
    })

    for (var i = 0; i < this.limits.width * this.limits.height; i++) {
      this.map.push({
        name: 'floor',
        index: i
      })
    }

    for (var i = 0; i < 10; i++) {
      this.map[i + 10 + 10 * this.limits.width].name = 'wall'
    }
  }
}

export default World
export const world = new World
