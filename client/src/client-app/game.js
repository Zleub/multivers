function setGameListeners(layer, player, scale) {
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
        if (this.user.offset[1] + 1 < scale) {
          this.user.offset[1] = this.user.offset[1] + 1
        }
        else {
          this.user.offset[1] = 0
          this.user.position[1] -= 1
          player.position({
            x: player.x(),
            y: player.y() - scale
          })
        }
        break
        case 'ArrowDown':
        if (this.user.offset[1] - 1 > -scale) {
          this.user.offset[1] = this.user.offset[1] - 1
        }
        else {
          this.user.offset[1] = 0
          this.user.position[1] += 1
          player.position({
            x: player.x(),
            y: player.y() + scale
          })
        }
        break
        case 'ArrowLeft':
        if (this.user.offset[0] + 1 < scale) {
          this.user.offset[0] = this.user.offset[0] + 1
        }
        else {
          this.user.offset[0] = 0
          this.user.position[0] -= 1
          player.position({
            x: player.x() - scale,
            y: player.y()
          })
        }
        break
        case 'ArrowRight':
        if (this.user.offset[0] - 1 > -scale) {
          this.user.offset[0] = this.user.offset[0] - 1
        }
        else {
          this.user.offset[0] = 0
          this.user.position[0] += 1
          player.position({
            x: player.x() + scale,
            y: player.y()
          })
        }
        break
      }

      this.notifyPath('user.offset.0')
      this.notifyPath('user.offset.1')
      this.notifyPath('user.position.0')
      this.notifyPath('user.position.1')
      player.offsetX(this.user.offset[0])
      player.offsetY(this.user.offset[1])
      layer.draw()
    })

    window.requestAnimationFrame(loop)
  }

  window.requestAnimationFrame(loop)

}
