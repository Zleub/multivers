/* @flow */

import {type Player_t} from './Player'
import Drawable, {type Drawable_t} from './Drawable'
import Ressource from './Ressource'

/**
*/
export const newPlayer = function (world : World_t, player : Player_t) {
  world.players.push(player)
}

/**
*/
export type World_t = {
  limits: {
    width: number,
    height: number
  },
  players: Array<Player_t>,
  spawn: Array<number>,
  map: Array<string>,
  tiles: {
    [tile_name: string]: Drawable_t
  }
}

/**
*/
const World = function () : World_t {
  const _ = {
    limits: {
      width: 1000,
      height: 1000
    },
    players : [],
    spawn : [0, 0],
    map : [],
    tiles : {},
  }
  for (var i = 0; i < _.limits.width * _.limits.height; i++) {
    _.map.push('floor')
  }
  Object.setPrototypeOf(_, Ressource)
  return _
}

export default World
