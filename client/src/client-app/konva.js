function setupKonva() {
  var scale = 8
  var width = 800
  var height = 640
  let center = {
    x: Math.floor( Math.floor(width / scale) / 2),
    y: Math.floor( Math.floor(height / scale) / 2)
  }

  var stage = new Konva.Stage({
    width,
    height,
    container: this.$.container
  })

  var that = this
  var layer = new Konva.Layer()
  stage.add(layer)

  for (var x = 0; x < width; x += scale) {
    for (var y = 0; y < height; y += scale) {
      let r = new Konva.Rect({
        x: x,
        y: y,
        width: scale,
        height: scale,
        stroke: 'black',
        strokeWidth: 1
      })
      r.on('mouseover', function () {
        that.set('content', this.attrs.content)
      })
      layer.add(r)
    }
  }

  let player = new Konva.Rect({
    x: center.x * scale,
    y: center.y * scale,
    width: scale,
    height: scale,
    stroke: 'black',
    strokeWidth: 1,
    offsetX: this.user.offset[0],
    offsetY: this.user.offset[1]
  })
  player.on('mouseover', function () {
    that.set('content', this.attrs.content)
  })
  player.setAttrs({
    content: [ this.user.name ],
    fill: 'yellow'
  })
  console.log(player)

  layer.add(player)

  fetchMultivers('/world').then(e => e.json().then(res => {
      res.world.forEach( (e) => {
        let _ = Array.from(layer.children).find(_ => {
          return _.x() == (center.x + e.x) * scale && _.y() == (center.y + e.y) * scale
        })
        if (_) {
          switch (e.name) {
            case 'floor':
                _.setAttrs({
                  content: [ e ],
                  fill: 'maroon'
                })
              break
            case 'wall':
                _.setAttrs({
                  content: [ e ],
                  fill: 'grey'
                })
              break
            default :
                _.setAttrs({
                  content: [ e ]
                })
          }
        }
      })

      setGameListeners.call(this, layer, player, scale)
      layer.draw()
  }))
}