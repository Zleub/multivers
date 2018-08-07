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

      // this.notifyPath('user.offset.0')
      // this.notifyPath('user.offset.1')
      // this.notifyPath('user.position.0')
      // this.notifyPath('user.position.1')
      // player.offsetX(this.user.offset[0])
      // player.offsetY(this.user.offset[1])

      // layer.draw()
    })

    window.requestAnimationFrame(loop)
  }

  window.requestAnimationFrame(loop)

}
