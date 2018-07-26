/* @flow */

import {type Player_t} from './Player'
import World, {newPlayer, type World_t} from './World'

const express = require('express')
const app = express()
const world = World()

newPlayer(world, {
  name: "local",
  ip: "::ffff:127.0.0.1",
  position: world.spawn
})

app.get('/', (req : express$Request, res: express$Response) =>
  res.end(console.log(req)))

app.get('/me', (req : express$Request, res: express$Response) =>
  res.end(world.players.filter(e =>
    e.ip == req.connection.remoteAddress).toString()))

app.listen(4242, 'localhost')
