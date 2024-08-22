import fs from 'fs'
import readline from 'node:readline'

const generatedRegEx = /.*\.(d\.ts|js|mjs)$/

const srcFiles = fs.globSync('src/**/*', { cwd: import.meta.dirname })
  .filter(name => name.match(generatedRegEx))

if (srcFiles.length === 0) {
  process.exit(0)
}

const rl = readline.createInterface(({
  input: process.stdin,
  output: process.stdout,
}))

console.log('Files to delete:', srcFiles)

rl.question('Should we delete files? (Y)', (ans) => {
  if ('Y' === ans) {
    for (const file of srcFiles) {
      fs.rmSync(file)
    }
  }
  rl.close()
})
