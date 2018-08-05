/* @flow */

import {type Player_t} from './Player'
import Drawable, {config, type Drawable_t} from './Drawable'
import Ressource from './Ressource'
import Wiki from './Wiki'

export const addPlayer = function (world : World_t, player : Player_t) {
  Wiki.events.push({
    timestamp: Date.now(),
    event: `A new player arise. [${player.name} @ ${player.position[0]}, ${player.position[1]}]`
  })
  world.players.push(player)
}

export type World_t = {
  limits: {
    width: number,
    height: number
  },
  players: Array<Player_t>,
  spawn: Array<number>,
  map: Array<{
    name: string,
    index: number
  }>,
  tiles: {
    [tile_name: string]: Drawable_t
  }
}

Drawable({
  name: 'floor'
})

const size = 32
const World = function () : World_t {
  const _ = {
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
  }

  for (var i = 0; i < _.limits.width * _.limits.height; i++) {
    _.map.push({
      name: 'floor',
      index: i
    })
  }

  for (var i = 0; i < 10; i++) {
    _.map[i + 10 + 10 * _.limits.width].name = 'wall'
  }
  Object.setPrototypeOf(_, Ressource)
  return _
}

export default World
