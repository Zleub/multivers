
/* @flow */

import Drawable, {config, type Drawable_t} from './Drawable'
import Tileset from './Tileset'
import Player from './Player'
import World, {world, addPlayer} from './World'
import move from './Movement'
import { computeFOV } from './FOV'
import Wiki from './Wiki'

import { writeFileSync } from 'fs'

var Time = require('time-diff');
var time = new Time();

if (process.argv.find(e => e == '--log' || e == '-l'))
  writeFileSync("multivers.log", "")
var end = (name) => {
  if (process.argv.find(e => e == '--log' || e == '-l'))
    writeFileSync("multivers.log", `${new Date(Date.now()).toISOString()} ${name}: ${time.end(name, 'ms')}\n`, { flag: "a" })
  else
    console.log(`${new Date(Date.now()).toISOString()} ${name}: ${time.end(name, 'ms')}`)
}

time.start('init');


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
  ip: "127.0.0.1",
  position: [16, 16]
}))

// Tileset({
//   path: 'assets/lpc-terrains/',
//   tilemap: 'terrain-v7.tsx'
// })

let debug = (req: express$Request, res, next) => {
  // console.log(`${req.url}: ${JSON.stringify(req.headers.user, null, 2)}`)
  next()
}

app.use(debug)

/** What yp ? */
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
  fs.readFile('./client/index.html', (err, data) => res.end(data))
)
app.get(/(.+\.(html|js))/, (req : express$Request, res: express$Response) =>
  fs.readFile(`./client/${req.params['0']}`, (err, data) => res.end(data))
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
      time.start('ws');
      let position = [ player.position[0], player.position[1] ]

      if (msg == 'ArrowUp') {
        move(player, { up: 2, down: 0, left: 0, right: 0 })
      }
      if (msg == 'ArrowDown') {
        move(player, { up: 0, down: 2, left: 0, right: 0 })
      }
      if (msg == 'ArrowLeft') {
        move(player, { up: 0, down: 0, left: 2, right: 0 })
      }
      if (msg == 'ArrowRight') {
        move(player, { up: 0, down: 0, left: 0, right: 2 })
      }

      if (position[0] != player.position[0] || position[1] != player.position[1]) {
        let fov = computeFOV(player.position)

        let add = fov.filter(e => !player.fov.find(_ => _[0] == e[0] && _[1] == e[1]) )
        let minus = player.fov.filter(e => !fov.find(_ => _[0] == e[0] && _[1] == e[1]) )
        player.fov = fov
        ws.send(JSON.stringify({
          position: player.position,
          offset: player.offset,
          add: world.map.filter( (e, x, y) => {
              return add.find( e => e[0] == x && e[1] == y) ? true : false
          }).map(e => ({
              name: e.name,
              x: e.x - player.position[0],
              y: e.y - player.position[1]
            })),
          minus: world.map.filter( (e, x, y) => {
              return minus.find( e => e[0] == x && e[1] == y) ? true : false
          }).map(e => ({
              name: e.name,
              x: e.x - player.position[0],
              y: e.y - player.position[1]
            }))
        }))
      }
      else {
        ws.send(JSON.stringify({
          position: player.position,
          offset: player.offset
        }))
      }
      end('ws');
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
  time.start('world');
  const player = world.players.filter(e => e.ip == req.connection.remoteAddress)[0]

  // const fov = 16

  let fov = computeFOV(player.position)
  // console.log( fov.filter(e => !player.fov.find(_ => _[0] == e[0] && _[1] == e[1]) ) )

  player.fov = fov
  res.end(JSON.stringify({
    position: player.position,
    offset: player.offset,
    add: world.map.filter( (e, x, y) => {
        return player.fov.find( e => e[0] == x && e[1] == y) ? true : false
    }).map(e => ({
        name: e.name,
        x: e.x,
        y: e.y
      }))
  }))
  end('world');

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
end('init');

app.listen(4242, 'localhost')
