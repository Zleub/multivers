complete -f -c cli.js -a "(./cli.js -h)"
complete -f -c cli -a "(./cli.js -h)"
function cli
  command ./cli.js $argv
end
