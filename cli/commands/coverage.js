const execSync = require('child_process').execSync

const cmd = 'flow-coverage-report'
const args = [
  `-c 8`,
  `-i "*.js"`,
  `-i "**/*.js"`,
  `-x "flow-coverage/**"`,
  `-x "flow-typed/**"`,
  `-x "node_modules/**"`,
  `-x "*_build/**"`,
  `-x "docs/**"`,
]
module.exports = (argv) =>
  execSync(`${cmd} ${args.join(' ')} ${argv.join(' ')}`).toString()
