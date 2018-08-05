/* @flow */

import Tileset from './Tileset'
import Player, {type Player_t} from './Player'
import World, {addPlayer, type World_t} from './World'
import Wiki from './Wiki'

const fs = require('fs')
const express = require('express')
const app = express()

const expressWs = function (app: express$Application) : any {
  require('express-ws')(app);
  return app
}

const ws_app = expressWs(app)
const world = World()

addPlayer(world, Player(world, {
  name: "local",
  ip: "127.0.0.1"
}))

Tileset({
  path: 'assets/lpc-terrains/',
  tilemap: 'terrain-v7.tsx'
})

let debug = (req: express$Request, res, next) => {
  console.log(`${req.url}: ${JSON.stringify(req.headers, null, 2)}`)
  next()
}

app.use(debug)

/**
 * @api {get} / root
 * @apiName Root
 * @apiGroup All
 */
app.get('/', (req : express$Request, res: express$Response) =>
  fs.readFile('./build/client/index.html', (err, data) => res.end(data))
)

/**
 * @api {get} /me user page
 * @apiName me
 * @apiGroup User
 */
app.get('/me', (req : express$Request, res: express$Response) =>
  res.end(world.players.filter(e => e.ip == req.connection.remoteAddress).toString()))

app.get('/world', (req : express$Request, res: express$Response) => {
  const user: Player_t = JSON.parse(req.headers.user)

  const fov = 16
  res.end( JSON.stringify({
    world: world.map.filter( (e, i) => {
      const x = i % world.limits.width
      const y = Math.floor(i / world.limits.width)
      return user.position[0] - fov <= x && x <= user.position[0] + fov
        && user.position[1] - fov <= y && y <= user.position[1] + fov
       && (x - user.position[0]) ** 2 + (y - user.position[1]) ** 2 < fov ** 2
    } ).map(e => ({
      name: e.name,
      x: e.index % world.limits.width - user.position[0],
      y: Math.floor(e.index / world.limits.width) - user.position[1]
    })),
    limits: {
      fov
    }
  }) )
})

app.get('/tile/:name', (req: express$Request, res: express$Response) => {
  console.log(world.tiles, req.params.name)
  res.end( JSON.stringify(world.tiles[req.params.name]) )
})

app.get('/wiki', (req: express$Request, res: express$Response) => {
  res.end( JSON.stringify(Wiki, null, 2) )
})

console.log(Wiki)

ws_app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
})
//
// ws_app.ws('/me', function(ws, req) {
//   ws.on('message', function(msg) {
//     ws.send(world.players.filter(e =>
//       e.ip == req.connection.remoteAddress).toString())
//   });
// })

app.listen(4242, 'localhost')
