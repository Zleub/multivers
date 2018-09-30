const keys_code_to_name = {
  38: 'up',
  87: 'w',

  37: 'left',
  65: 'a',

  40: 'down',
  83: 's',

  39: 'right',
  68: 'd',

  32: 'space',
  16: 'leftShift'
}

const keys_alias = {
  forward: [38, 87],
  left: [37, 65],
  backward: [49, 83],
  right: [39, 68],
  up: [32],
  down: [16],
  jump: [32]
}

let keys = Object.entries(keys_alias).reduce( (p, [k,v]) => {
  p[k] = false
  return p
}, {} )

const keys_press = {
  jump : () => {
    // if ( canJump === true )
    //   velocity.y += 80;
    // canJump = false;
  }
}

const solve_alias = function (code) {
  return Object.entries(keys_alias).reduce( (p, [k,v]) => {
    if (v.find(e => e == code)) {
      console.log(`found ${k} for ${code}`)
      p.push(k)
    }
      return p
  }, [] )
}

const onKeyUp = function ( event ) {
  solve_alias(event.keyCode).forEach(e => keys[ e ] = false)
}

const onKeyDown = function ( event ) {
  if ( controlsEnabled === false && run)
    document.body.requestPointerLock()

  solve_alias(event.keyCode).forEach(e => keys[ e ] = true)
  console.dir(keys)
};

const onKeyPress = function ( event ) {
  solve_alias(event.keyCode).forEach(e => {
    if (keys_press[ e ])
      keys_press[ e ]()
  })
}
