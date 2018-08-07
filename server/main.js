/* @flow */

import Drawable, {config, type Drawable_t} from './Drawable'
import Tileset from './Tileset'
import Player from './Player'
import World, {world, addPlayer} from './World'
import Wiki from './Wiki'

const fs = require('fs')
const express = require('express')
const crypto = require('crypto')
const app = express()

const expressWs = function (app: express$Application) : any {
  require('express-ws')(app);
  return app
}

const ws_app = expressWs(app)

addPlayer(world, new Player(world, {
  name: "local",
  ip: "127.0.0.1"
}))

Drawable({
  name: 'floor'
})

Tileset({
  path: 'assets/lpc-terrains/',
  tilemap: 'terrain-v7.tsx'
})

let debug = (req: express$Request, res, next) => {
  // console.log(`${req.url}: ${JSON.stringify(req.headers.user, null, 2)}`)
  next()
}

app.use(debug)

/**
*/
let isUser = (req: express$Request, res, next) => {
  if (world.players.filter(e => e.ip == req.connection.remoteAddress)[0])
    next()
  else {
    res.status(400).end()
  }
}

/**
 * @api {get} / root
 * @apiName Root
 * @apiGroup All
 */
app.get('/', (req : express$Request, res: express$Response) =>
  fs.readFile('./build/client/index.html', (err, data) => res.end(data))
)

const scale = 16

/**
 * @api {get} /me user page
 * @apiName me
 * @apiGroup User
 */
app.get('/me', isUser, (req : express$Request, res: express$Response) => {
  let player = world.players.filter(e => e.ip == req.connection.remoteAddress)[0]
  player.token = crypto.createHmac('sha256', Date.now().toString() + JSON.stringify(player.ip)).digest('hex');

  let connected = false
  ws_app.ws('/' + player.token, function(ws, req) {
    connected = true
    ws.on('message', function(msg) {
      if (msg == 'ArrowUp') {
        if (player.offset[1] + 2 < scale) {
          player.offset[1] = player.offset[1] + 2
          ws.send(JSON.stringify({
            position: player.position,
            offset: player.offset
          }));
        }
        else {
          player.offset[1] = 0
          player.position[1] -= 1
          let fov = player.computeFOV(player.position, 16)
          ws.send(JSON.stringify({
            offset: player.offset,
            position: player.position,
            tiles: world.map.filter( (e, i) => {
                const x = i % world.limits.width
                const y = Math.floor(i / world.limits.width)

                return fov.find( e => e[0] == x && e[1] == y)
            }).map(e => ({
                name: e.name,
                x: e.index % world.limits.width - player.position[0],
                y: Math.floor(e.index / world.limits.width) - player.position[1]
              }))
          }));
        }
      }
      if (msg == 'ArrowDown') {
        if (player.offset[1] - 2 > -scale) {
          player.offset[1] = player.offset[1] - 2
          ws.send(JSON.stringify({
            position: player.position,
            offset: player.offset
          }));
        }
        else {
          player.offset[1] = 0
          player.position[1] += 1
          let fov = player.computeFOV(player.position, 16)
          ws.send(JSON.stringify({
            offset: player.offset,
            position: player.position,
            tiles: world.map.filter( (e, i) => {
                const x = i % world.limits.width
                const y = Math.floor(i / world.limits.width)

                return fov.find( e => e[0] == x && e[1] == y)
            }).map(e => ({
                name: e.name,
                x: e.index % world.limits.width - player.position[0],
                y: Math.floor(e.index / world.limits.width) - player.position[1]
              }))
          }));
        }
      }
      if (msg == 'ArrowLeft') {
        if (player.offset[0] + 2 < scale) {
          player.offset[0] = player.offset[0] + 2
          ws.send(JSON.stringify({
            position: player.position,
            offset: player.offset
          }));
        }
        else {
          player.offset[0] = 0
          player.position[0] -= 1
          let fov = player.computeFOV(player.position, 16)
          ws.send(JSON.stringify({
            offset: player.offset,
            position: player.position,
            tiles: world.map.filter( (e, i) => {
                const x = i % world.limits.width
                const y = Math.floor(i / world.limits.width)

                return fov.find( e => e[0] == x && e[1] == y)
            }).map(e => ({
                name: e.name,
                x: e.index % world.limits.width - player.position[0],
                y: Math.floor(e.index / world.limits.width) - player.position[1]
              }))
          }));
        }
      }
      if (msg == 'ArrowRight') {
        if (player.offset[0] - 2 > -scale) {
          player.offset[0] = player.offset[0] - 2
          ws.send(JSON.stringify({
            position: player.position,
            offset: player.offset
          }));
        }
        else {
          player.offset[0] = 0
          player.position[0] += 1
          let fov = player.computeFOV(player.position, 16)
          ws.send(JSON.stringify({
            offset: player.offset,
            position: player.position,
            tiles: world.map.filter( (e, i) => {
                const x = i % world.limits.width
                const y = Math.floor(i / world.limits.width)

                return fov.find( e => e[0] == x && e[1] == y)
            }).map(e => ({
                name: e.name,
                x: e.index % world.limits.width - player.position[0],
                y: Math.floor(e.index / world.limits.width) - player.position[1]
              }))
          }));
        }
      }


    });
  })
  setTimeout(() => {
    if (!connected) {
      console.log('delete ' + player.token)
      ws_app.delete('/' + player.token)
    }
  }, 10000);

  res.end(player.toString())
})

/**
 * @api {get} /world World
 * @apiName World
 * @apiGroup All
 */
app.get('/world', (req : express$Request, res: express$Response) => {
  // const user = JSON.parse(req.headers.user)
  const player = world.players.filter(e => e.name == "local")[0]

  // const fov = 16

  let fov = player.computeFOV(player.position, 16)
  res.end(JSON.stringify({
    world: world.map.filter( (e, i) => {
        const x = i % world.limits.width
        const y = Math.floor(i / world.limits.width)

        return fov.find( e => e[0] == x && e[1] == y)
    }).map(e => ({
        name: e.name,
        x: e.index % world.limits.width - player.position[0],
        y: Math.floor(e.index / world.limits.width) - player.position[1]
      }))
  }))
  // res.end( JSON.stringify({
  //   world: world.map.filter( (e, i) => {
  //     const x = i % world.limits.width
  //     const y = Math.floor(i / world.limits.width)
  //     return user.position[0] - fov <= x && x <= user.position[0] + fov
  //       && user.position[1] - fov <= y && y <= user.position[1] + fov
  //      && (x - user.position[0]) ** 2 + (y - user.position[1]) ** 2 < fov ** 2
  //   } ).map(e => ({
  //     name: e.name,
  //     x: e.index % world.limits.width - user.position[0],
  //     y: Math.floor(e.index / world.limits.width) - user.position[1]
  //   })),
  //   limits: {
  //     fov
  //   }
  // }) )
})

/**
 * @api {get} /tile/:name Access a particular tile
 * @apiName tile
 * @apiGroup User
 */
app.get('/tile/:name', isUser, (req: express$Request, res: express$Response) => {
  // console.log(world.tiles, req.params.name)
  res.end( JSON.stringify(world.tiles[req.params.name]) )
})

/**
 * @api {get} /wiki read the wiki
 * @apiName Wiki
 * @apiGroup User
 */
app.get('/wiki', isUser, (req: express$Request, res: express$Response) => {
  res.end( JSON.stringify(Wiki, null, 2) )
})

console.log(Wiki)

app.listen(4242, 'localhost')
