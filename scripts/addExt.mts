import { readFileSync, writeFileSync, globSync } from 'fs'
import path from 'path'
import type { Literal, StringLiteral } from 'jscodeshift'
import jsCodeshift from 'jscodeshift'

const resolveRelativePath = (importingFile: string, source: StringLiteral | Literal) => {
  const relativePath = source.value as string
  const ext = path.extname(importingFile)
  if (!relativePath.startsWith('.')) {
    return source
  }

  const withExt = relativePath.replace(/\.ts$/, ext)

  if (source.type === 'Literal') {
    return jsCodeshift.types.builders.literal(withExt)
  } else {
    return jsCodeshift.types.builders.stringLiteral(withExt)
  }
}

const transformer = (filePath: string, file: string) => {
  const rootSource = jsCodeshift(file)

  // esbuild imports everything, and then does an export object
  rootSource.find(jsCodeshift.ImportDeclaration)
    .forEach(({ value }) => {
      value.source = resolveRelativePath(filePath, value.source as Literal)
    })

  rootSource.find(jsCodeshift.CallExpression)
    .forEach(({ value }) => {
      if (value.callee.type === 'Identifier' && value.callee.name === 'require') {
        const arg = value.arguments[0] as StringLiteral
        value.arguments[0] = resolveRelativePath(filePath, arg)
      }
    })

  return rootSource.toSource()
}

export const addJsExtensions = async (distDir: string) => {
  const files = globSync(['**/*.js', '**/*.mjs'], { cwd: distDir })
    .map((filename) => path.join(distDir, filename))

  for (const file of files) {
    const fileSource = readFileSync(file, 'utf-8')
    const source = transformer(file, fileSource)

    writeFileSync(file, source)
  }
}
