/* @flow */

import {type World_t} from './World'
import Ressource from './Ressource'

/**
*/
export type Player_t = {
  name: string,
  ip: string,
  position: Array<number>
}

/**
*/
export type PlayerOpt_t = {
  name: string,
  ip: string,
  position?: Array<number>
}

/**
*/
const Player = function (world: World_t, opts : PlayerOpt_t) : Player_t {
  const _ = {
    name: opts.name,
    ip: opts.ip,
    position: opts.position || world.spawn
  }
  Object.setPrototypeOf(_, Ressource)
  return _
}

export default Player
