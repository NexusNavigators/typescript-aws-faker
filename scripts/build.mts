import { build } from 'esbuild'
import { execFileSync } from 'node:child_process'
import semver from 'semver'
import fs from 'fs'
import path from 'path'
import { addJsExtensions } from './addExt.mts'
import { generatedFiles } from './clean.mts'

const rootDir = path.resolve(import.meta.dirname, '..')

generatedFiles.forEach((filename) => fs.rmSync(filename))

execFileSync('npx', ['tsc', '--project', 'tsconfig.build.json'])

const entryPoints = fs.globSync('src/**/!(*.d).ts', { cwd: rootDir })

const packageString = fs.readFileSync('./package.json', 'utf-8')
const { engines } = JSON.parse(packageString) as { engines: { node: string } }

const nodeVersion = semver.minVersion(engines.node, { loose: false })?.version
if (!nodeVersion) {
  throw new Error('Missing engines.node version from package.json')
}

await Promise.all([
  build({
    bundle: false,
    sourcemap: false,
    platform: 'node',
    target: `node${nodeVersion}`,
    outdir: 'src',
    format: 'cjs',
    entryPoints,
  }),
  build({
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
  }),
])

addJsExtensions(`${rootDir}/src`)
