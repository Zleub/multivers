
/* @flow */

import Drawable, {config, type Drawable_t} from './Drawable'
import Tileset from './Tileset'
import Player from './Player'
import World, {world, addPlayer} from './World'
import {openSimplex} from './Map'
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
  // position: [16, 16]
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

function flattenDeep(arr1) {
   return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
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

  let _ = JSON.stringify({
    position: player.position,
    offset: player.offset,
    add: flattenDeep(world.map.map).filter(e => e.name != 'air') /* .filter( (e, x, y) => {
        return player.fov.find( e => e[0] == x && e[1] == y) ? true : false
    }).map(e => ({
        name: e.name,
        x: e.x,
        y: e.y
      })) */
  })
  res.end(_, () => end('world'))

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

app.get('/sharpen', (req : express$Request, res: express$Response) => {
  time.start('sharpen');
  const player = world.players.filter(e => e.ip == req.connection.remoteAddress)[0]
  let fov = computeFOV(player.position)

  // let _res = world.map.shallow_map
  // let sharpen = [
  //   [ 0, -1,  0],
  //   [-1,  5, -1],
  //   [ 0, -1,  0]
  // ]
  let sharpen = [
    [ 0, 0,  0],
    [ -1, 10,  0],
    [ 0, 0,  0]
  ]

  let sm = world.map.shallow_map
  let _res = flattenDeep(sm).map(e => {
    let m = [
      [ sm[e.x - 1 < 0 ? 0 : e.x - 1][e.z - 1 < 0 ? 0 : e.z - 1].y, sm[e.x][e.z - 1 < 0 ? 0 : e.z - 1].y , sm[e.x + 1 >= world.map.limits.width ? world.map.limits.width : e.x + 1][e.z - 1 < 0 ? 0 : e.z - 1].y ],
      [     sm[e.x - 1 < 0 ? 0 : e.x - 1][e.z].y,                e.y , sm[e.x + 1 >= world.map.limits.width ? world.map.limits.width : e.x + 1][e.z].y     ],
      [ sm[e.x - 1 < 0 ? 0 : e.x - 1][e.z + 1 >= world.map.limits.width ? world.map.limits.width : e.z + 1].y, sm[e.x][e.z + 1 >= world.map.limits.width ? world.map.limits.width : e.z + 1].y , sm[e.x + 1 >= world.map.limits.width ? world.map.limits.width : e.x + 1][e.z + 1 >= world.map.limits.width ? world.map.limits.width : e.z + 1].y ],
    ]

    let r = m[0][0] * sharpen[0][0] +
      m[0][1] * sharpen[0][1] +
      m[0][2] * sharpen[0][2] +
      m[1][0] * sharpen[1][0] +
      m[1][1] * sharpen[1][1] +
      m[1][2] * sharpen[1][2] +
      m[2][0] * sharpen[2][0] +
      m[2][1] * sharpen[2][1] +
      m[2][2] * sharpen[2][2]

    return Object.assign({}, e, { y : Math.floor(r / 9) })
  })

  // _res.map(e => {
  //   let m = [
  //     [],
  //     [, e.y , world.map.map[e.x][] ],
  //     []
  //   ]
  // })

  // for (var x = 1; x < world.map.limits.width; x++) {
  //   for (var y = 1; y < world.map.limits.depth; y++) {
  //
  //     let value = Math.floor( (openSimplex.noise2D( x / 20, y / 20) + 0.8) * world.map.limits.height / 4)
  //     if (value < 0)
  //       value = 0
  //
  //     if (
  //       world.map.map[x - 1] &&
  //       world.map.map[x - 1][value] &&
  //       world.map.map[x] &&
  //       world.map.map[x][value] &&
  //       world.map.map[x + 1] &&
  //       world.map.map[x + 1][value] &&
  //       world.map.map[x - 1][value][y - 1] && world.map.map[x][value][y - 1] && world.map.map[x + 1][value][y - 1] &&
  //       world.map.map[x - 1][value][y]     && world.map.map[x][value][y]     && world.map.map[x + 1][value][y] &&
  //       world.map.map[x - 1][value][y + 1] && world.map.map[x][value][y + 1] && world.map.map[x + 1][value][y + 1])
  //     {
  //
  //       let _value =
  //       Math.floor( ((
  //           world.map.map[x - 1][value][y - 1].y * sharpen[0][0]
  //         + world.map.map[x - 1][value][y    ].y * sharpen[0][1]
  //         + world.map.map[x - 1][value][y + 1].y * sharpen[0][2]
  //         + world.map.map[x    ][value][y - 1].y * sharpen[1][0]
  //         + world.map.map[x    ][value][y    ].y * sharpen[1][1]
  //         + world.map.map[x    ][value][y + 1].y * sharpen[1][2]
  //         + world.map.map[x + 1][value][y - 1].y * sharpen[2][0]
  //         + world.map.map[x + 1][value][y    ].y * sharpen[2][1]
  //         + world.map.map[x + 1][value][y + 1].y * sharpen[2][2] ) / 9) )
  //
  //       // console.log(_value)
  //
  //       if (!_res[x])
  //         _res[x] = []
  //       if (!_res[x][value])
  //         _res[x][value] = []
  //
  //       _res[x][value][y] = {
  //         name: 'floor',
  //         x: x,
  //         y: _value,
  //         z: y
  //       }
  //     }
  //     else {
  //       if (!_res[x])
  //         _res[x] = []
  //       if (!_res[x][value])
  //         _res[x][value] = []
  //
  //       // console.log(x, value, y, world.map.map[x][value][y])
  //       // if (world.map.map[x][value][y])
  //         _res[x][value][y] = world.map.map[x][value][y]
  //     }
  //   }
  // }


  let _ = JSON.stringify({
    position: player.position,
    offset: player.offset,
    add: flattenDeep(_res).filter(e => {
      if (e)
        return e.name != 'air'
    }) /* .filter( (e, x, y) => {
        return player.fov.find( e => e[0] == x && e[1] == y) ? true : false
    }).map(e => ({
        name: e.name,
        x: e.x,
        y: e.y
      })) */
  })
  res.end(_, () => end('sharpen'))

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
