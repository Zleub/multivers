class Game {
  constructor(container, user) {
    this.user = user

    this.scale = 16
    this.width = 800
    this.height = 640
    this.center = {
      x: Math.floor( Math.floor(this.width / this.scale) / 2),
      y: Math.floor( Math.floor(this.height / this.scale) / 2)
    }

    this.stage = new Konva.Stage({
      width: this.width,
      height: this.height,
      container: container
    })

    this.layer = new Konva.Layer()
    this.stage.add(this.layer)

    this.map_group = new Konva.Group()
    for (var x = 0; x < this.width; x += this.scale) {
      for (var y = 0; y < this.height; y += this.scale) {
        let r = new Konva.Rect({
          x: x,
          y: y,
          width: this.scale,
          height: this.scale
        })
        // r.on('mouseover', function () {
          // that.set('content', this.attrs.content)
        // })
        this.map_group.add(r)
      }
    }
    this.layer.add(this.map_group)

    this.player = new Konva.Rect({
      x: this.center.x * this.scale,
      y: this.center.y * this.scale,
      width: this.scale,
      height: this.scale,
      // stroke: 'black',
      // strokeWidth: 1,
      offsetX: this.user.offset[0],
      offsetY: this.user.offset[1]
    })
    // this.player.on('mouseover', function () {
    //   that.set('content', this.attrs.content)
    // })
    this.player.setAttrs({
      content: [ this.user.name ],
      fill: 'yellow'
    })

    this.layer.add(this.player)

    fetchMultivers('/world').then(e => e.json().then(res => {
        res.add.forEach( (e) => {
          let _ = Array.from(this.map_group.children).find(_ => {
            return _.x() == (e.x - this.user.position[0] + this.center.x) * this.scale
              && _.y() == (e.y - this.user.position[1] + this.center.y) * this.scale
          })
          if (_) {
            switch (e.name) {
              case 'floor':
                  _.setAttrs({
                    content: [ e ],
                    opacity: 1,
                    fill: 'maroon'
                  })
                break
              case 'wall':
                  _.setAttrs({
                    content: [ e ],
                    opacity: 1,
                    fill: 'grey'
                  })
                break
              default :
                  _.setAttrs({
                    opacity: 1,
                    content: [ e ]
                  })
            }
          }
        })

        this.setListeners()
        this.layer.draw()
    }))

    this.socket = new WebSocket('ws://localhost:4242/' + this.user.token);
    this.socket.addEventListener('open', (event) => {
      this.socket.send('Hello Server!');
    });
    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      this.user.offset = msg.offset

      if (msg.add && msg.minus) {
        console.log(msg.position[0] - this.user.position[0])
        console.log(msg.position[1] - this.user.position[1])

        let width = this.width % this.scale
        let height = Math.floor( this.height / this.scale )
        this.map_group.children.forEach( (e,i) => {
          let x = i % width
          let y = Math.floor(i / width)

          // if (konva.layer.map_group[])
        })

        this.user.position = msg.position
      }

      this.player.offsetX(this.user.offset[0])
      this.player.offsetY(this.user.offset[1])
      this.layer.draw()

    })
  }

  setListeners() {
    let pressed = {}

    window.addEventListener('keydown', (event) => {
      pressed[event.key] = true
    })

    window.addEventListener('keyup', (event) => {
      pressed[event.key] = false
    })

    let loop = () => {
      Object.keys(pressed).filter( k => pressed[k] == true).forEach( key => {
        switch (key) {
          case 'ArrowUp':
            this.socket.send('ArrowUp')
            break
          case 'ArrowDown':
            this.socket.send('ArrowDown')
            break
          case 'ArrowLeft':
            this.socket.send('ArrowLeft')
            break
          case 'ArrowRight':
            this.socket.send('ArrowRight')
            break
        }
      })
      window.requestAnimationFrame(loop)
    }
    window.requestAnimationFrame(loop)
  }

}
