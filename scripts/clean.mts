import fs from 'fs'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import path from 'path'

const generatedRegEx = /.*\.(d\.mts|d\.ts|js|mjs)$/
const rootDir = path.resolve(import.meta.dirname, '..')

export const generatedFiles = fs.globSync('src/**/*', { cwd: rootDir })
  .filter((name) => name.match(generatedRegEx))
  .map((name) => path.join(rootDir, name))

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (generatedFiles.length === 0) {
    process.exit(0)
  }

  const rl = readline.createInterface(({
    input: process.stdin,
    output: process.stdout,
  }))

  console.log('Files to delete:', generatedFiles)

  rl.question('Should we delete files? (Y)', (ans) => {
    if ('Y' === ans) {
      for (const file of generatedFiles) {
        fs.rmSync(file)
      }
    }
    rl.close()
  })
}
