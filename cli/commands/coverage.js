const execSync = require('child_process').execSync

const cmd = 'flow-coverage-report'
const args = [
  `-i "*.js"`,
  `-i "**/*.js"`,
  `-x "cli.js"`,
  `-x "cli/**"`,
  `-x "flow-coverage/**"`,
  `-x "flow-typed/**"`,
  `-x "node_modules/**"`,
  `-x "server_build/**"`
]
module.exports = () =>
  execSync(`${cmd} ${args.join(' ')}`).toString()
