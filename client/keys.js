const keys_code_to_name = {
  38: 'up',
  87: 'w',

  37: 'left',
  65: 'a',

  40: 'down',
  83: 's',

  39: 'right',
  68: 'd',

  32: 'space'
}

const keys_name_to_code = Object.entries(keys_code_to_name).reduce( (p, [k,v]) => {
  p[v] = Number(k)
  return p
}, {} )

const keys = Object.entries(keys_code_to_name).reduce( (p, [k,v]) => {
  p[v] = false
  return p
}, {} )

const keys_alias = {
  up: {
    codes: [38, 87]
  },
  left: {
    codes: [37, 65]
  },
  down: {
    codes: [49, 83]
  },
  right: {
    codes: [39, 68]
  },
  jump: {
    codes: [32]
  }
}

const keys_press = {
  jump : () => {
    if ( canJump === true )
      velocity.y += 80;
    canJump = false;
  }
}

const solve_alias = function (code) {
  return Object.entries(keys_alias).reduce( (p, [k,v]) => {
    if (v.codes.find(e => e == code))
      return k
    else
      return p
  }, null )
}

const onKeyUp = function ( event ) {
  keys[ solve_alias(event.keyCode) ] = false
}

const onKeyDown = function ( event ) {
  if ( controlsEnabled === false )
    document.body.requestPointerLock()

  keys[ solve_alias(event.keyCode) ] = true
};

const onKeyPress = function ( event ) {
  keys_press[ solve_alias(event.keyCode) ]()
}
