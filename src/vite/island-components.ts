import fs from 'fs/promises'
import _generate from '@babel/generator'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generate = _generate.default as typeof _generate
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const traverse = _traverse.default as typeof _traverse
import {
  jsxAttribute,
  jsxClosingElement,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  stringLiteral,
} from '@babel/types'
import type { Plugin } from 'vite'

export function islandComponents(): Plugin {
  return {
    name: 'transform-island-components',
    async load(id) {
      if (/islands/.test(id)) {
        const fileName = id.replace(/^.*app\/islands\//, '')

        const contents = await fs.readFile(id, 'utf-8')

        const ast = parse(contents, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        })

        if (ast) {
          let isFirstJSXElement = true

          traverse(ast, {
            JSXElement(path) {
              if (isFirstJSXElement) {
                const node = path.node
                const componentNameAttribute = jsxAttribute(
                  jsxIdentifier('component-name'),
                  stringLiteral(fileName)
                )
                node.openingElement.attributes.push(componentNameAttribute)
                const wrappingDiv = jsxElement(
                  jsxOpeningElement(
                    jsxIdentifier('div'),
                    [jsxAttribute(jsxIdentifier('component-wrapper'), stringLiteral('true'))],
                    false
                  ),
                  jsxClosingElement(jsxIdentifier('div')),
                  [node],
                  false
                )
                path.replaceWith(wrappingDiv)
                isFirstJSXElement = false
              }
            },
          })

          const { code } = generate(ast)

          return {
            code,
            map: null,
          }
        }
      }
    },
  }
}
