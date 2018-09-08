/* @flow */

import Player from './Player'
import { offset } from './Map'

export type Move_t = {
  up: number,
  down: number,
  left: number,
  right: number
}

const offset_limits = {
  up: offset,
  down: -offset,
  left: offset,
  right: -offset
}

export default function move(player: Player, opts: Move_t) {
  if (player.offset[1] + opts.up < offset) {
    player.offset[1] = player.offset[1] + opts.up
  }
  else {
    player.offset[1] = 0
    player.position[1] -= 1
  }

  if (player.offset[1] - opts.down > -offset) {
    player.offset[1] = player.offset[1] - opts.down
  }
  else {
    player.offset[1] = 0
    player.position[1] += 1
  }

  if (player.offset[0] + opts.left < offset) {
    player.offset[0] = player.offset[0] + opts.left
  }
  else {
    player.offset[0] = 0
    player.position[0] -= 1
  }

  if (player.offset[0] - opts.right > -offset) {
    player.offset[0] = player.offset[0] - opts.right
  }
  else {
    player.offset[0] = 0
    player.position[0] += 1
  }
}
