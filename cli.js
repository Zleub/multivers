#!/usr/bin/env node

const parse = require('path').parse

const opts = {
  '-h' : () => require('fs').readdir('./cli/commands/', (err, files) => {
    if (err)
      throw err
    else
      files.forEach(e => console.log(parse(e).name))
  })
}

if (Object.keys(opts).find(e => e == process.argv[2]))
  opts[process.argv[2]]()
else
  require('fs').readdir('./cli/commands/', (err, files) => {
    if (err)
      throw err;
    else {
      let cmd = files.filter(e => parse(e).name == process.argv[2])
      if (cmd[0]) {
        const str = './cli/commands/' + cmd[0]
        console.log( require(str)(process.argv.slice(3)) )
      }
      else
        opts['-h']()
    }
  })
