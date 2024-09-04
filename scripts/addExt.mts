import { readFileSync, writeFileSync, globSync } from 'fs'
import path from 'path'
import type { Literal, StringLiteral } from 'jscodeshift'
import jsCodeshift from 'jscodeshift'

function resolveRelativePath(importingFile: string, source: StringLiteral | Literal) {
  const relativePath = source.value as string
  const ext = path.extname(importingFile)
  if (!relativePath.startsWith('.')) {
    return relativePath
  }

  return relativePath.replace(/\.ts$/, ext)
}

const transformer = (filePath: string, file: string) => {
  const rootSource = jsCodeshift(file)

  // esbuild imports everything, and then does an export object
  rootSource.find(jsCodeshift.ImportDeclaration)
    .forEach(({ value }) => {
      value.source = jsCodeshift.types.builders.literal(resolveRelativePath(filePath, value.source as Literal))
    })

  rootSource.find(jsCodeshift.CallExpression)
    .forEach(({ value }) => {
      if (value.callee.type === 'Identifier' && value.callee.name === 'require') {
        const arg = value.arguments[0] as StringLiteral
        value.arguments[0] = jsCodeshift.types.builders.stringLiteral(resolveRelativePath(filePath, arg))
      }
    })

  return rootSource.toSource()
}

export function addJsExtensions(distDir: string) {
  const files = globSync(path.join(distDir, '**/*.{mjs,js}'))
  for (const file of files) {
    const fileSource = readFileSync(file, 'utf-8')
    const source = transformer(file, fileSource)

    writeFileSync(file, source)
  }
}
