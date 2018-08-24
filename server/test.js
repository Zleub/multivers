/* @flow */

import World, {world, addPlayer} from './World'

let limits = [4, 4, 4]
let X = (x) => x <= limits[0]
let Y = (y) => y <= limits[1]
let Z = (z) => z <= limits[2]

world.map.iter([0, 0, 0], X, Y, Z, (e, position) => {
  console.log(position)
  return null
} )
