import { build } from 'esbuild'
import semver from 'semver'
import fs from 'fs'

const srcFiles = fs.globSync('src/**/!(*.d).ts', { cwd: import.meta.dirname })
const entryPoints = [...srcFiles]

const packageString = fs.readFileSync('./package.json', 'utf-8')
const { engines } = JSON.parse(packageString) as { engines: { node: string } }

const nodeVersion = semver.minVersion(engines.node, { loose: false })?.version
if (!nodeVersion) {
  throw new Error('Missing engines.node version from package.json')
}
console.log(entryPoints)

void build({
  bundle: false,
  sourcemap: false,
  platform: 'node',
  target: `node${nodeVersion}`,
  outdir: 'src',
  format: 'cjs',
  entryPoints,
})

void build({
  bundle: false,
  sourcemap: false,
  platform: 'node',
  target: `node${nodeVersion}`,
  outdir: 'src',
  format: 'esm',
  outExtension: {
    '.js': '.mjs',
  },
  entryPoints,
})
