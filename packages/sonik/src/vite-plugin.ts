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
import type { JSXOpeningElement, JSXClosingElement } from '@babel/types'
import {
  jsxElement,
  jsxExpressionContainer,
  jsxAttribute,
  jsxIdentifier,
  stringLiteral,
} from '@babel/types'
import type { Plugin } from 'vite'

export function sonikVitePlugin(): Plugin {
  let idCounter = 0

  return {
    name: 'sonik-vite-plugin',
    async load(id) {
      if (/island/.test(id)) {
        const fileName = id.replace(/^.*src\/island\//, '')

        const contents = await fs.readFile(id, 'utf-8')

        const ast = parse(contents, {
          sourceType: 'module',
          plugins: ['jsx'],
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

                const idDiv = jsxAttribute(jsxIdentifier('id'), stringLiteral('id-' + idCounter))

                const newJSXOpeningElement: JSXOpeningElement = {
                  type: 'JSXOpeningElement',
                  name: jsxIdentifier('div'),
                  attributes: [idDiv],
                  selfClosing: false,
                }

                const newJSXClosingElement: JSXClosingElement = {
                  type: 'JSXClosingElement',
                  name: jsxIdentifier('div'),
                }

                const newElement = jsxElement(
                  newJSXOpeningElement,
                  newJSXClosingElement,
                  [jsxExpressionContainer(node)],
                  false
                )

                path.replaceWith(newElement)

                isFirstJSXElement = false
                idCounter++
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
