/* @flow */

export default function (req : express$Request, res: express$Response) {
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
}
