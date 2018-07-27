/* @flow */

import Player, {type Player_t} from './Player'
import World, {newPlayer, type World_t} from './World'

const express = require('express')
const app = express()

const expressWs = function (app: express$Application) : any {
  require('express-ws')(app);
  return app
}

const ws_app = expressWs(app)
const world = World()

newPlayer(world, Player(world, {
  name: "local",
  ip: "127.0.0.1"
}))

ws_app.get('/', (req : express$Request, res: express$Response) =>
  res.end('Hello World !'))

ws_app.get('/me', (req : express$Request, res: express$Response) =>
  res.end(world.players.filter(e =>
    e.ip == req.connection.remoteAddress).toString()))

ws_app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
})

ws_app.ws('/me', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(world.players.filter(e =>
      e.ip == req.connection.remoteAddress).toString())
  });
})

ws_app.listen(4242, 'localhost')
