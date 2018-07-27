module.exports = function (blessed, screen) {
  let box = blessed.box({
    left: 'center',
    top: 'center',
    shrink: true,
  })

  blessed.text({
    width: '100%',
    height: 1,
    left: 'center',
    top: '50%-1',
    parent: box,
    content: 'pass:'
  })

  let text = blessed.textbox({
    parent: box,
    bg: 'gray',
    width: '100%',
    height: 1,
    left: 'center',
    top: 'center',
    censor: true
  })

  box.text = text
  return box
}
