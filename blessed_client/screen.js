let connection_form = require('./connection')

module.exports = function (blessed) {
  var screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'my window title';
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  let connect_text = blessed.text({
    right: 1,
    content: '~',
    tags: true
  })

  let connect_form = connection_form(blessed, screen)

  screen.append( connect_text )

  const WebSocket = require('ws');
  const ws = new WebSocket('ws://localhost:4242/me');

  ws.on('open', function open() {
    ws.send('something');
    connect_text.setContent('{underline}~{/}')
    screen.render()
  });

  ws.on('message', function incoming(data) {
    connect_text.setContent('{underline}~{/}')

    screen.append( connect_form )
    connect_form.text.readInput((err, text) => {
      screen.remove(connect_form)
      screen.render()
    })
    screen.render()
  });


  return screen
}
