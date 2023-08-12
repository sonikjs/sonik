import fs from 'fs/promises'
import _generate from '@babel/generator'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generate = (_generate.default as typeof _generate) ?? _generate
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const traverse = (_traverse.default as typeof _traverse) ?? _traverse
import {
  identifier,
  jsxAttribute,
  jsxClosingElement,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  stringLiteral,
  callExpression,
  variableDeclarator,
  variableDeclaration,
  functionExpression,
  blockStatement,
  returnStatement,
  arrowFunctionExpression,
  jsxSpreadAttribute,
  jsxExpressionContainer,
  exportDefaultDeclaration,
} from '@babel/types'
// eslint-disable-next-line node/no-extraneous-import
import type { Plugin } from 'vite'
import { COMPONENT_NAME, DATA_SERIALIZED_PROPS } from '../constants'

const wrapWithHOC = (funcIdentifierName: string, componentName: string) => {
  return arrowFunctionExpression(
    [identifier('props')],
    blockStatement([
      variableDeclaration('const', [
        variableDeclarator(
          identifier('serializedProps'),
          callExpression(identifier('JSON.stringify'), [identifier('props')])
        ),
      ]),
      returnStatement(
        jsxElement(
          jsxOpeningElement(
            jsxIdentifier('div'),
            [jsxAttribute(jsxIdentifier('component-wrapper'))],
            false
          ),
          jsxClosingElement(jsxIdentifier('div')),
          [
            jsxElement(
              jsxOpeningElement(
                jsxIdentifier('div'),
                [
                  jsxAttribute(jsxIdentifier(COMPONENT_NAME), stringLiteral(componentName)),
                  jsxAttribute(
                    jsxIdentifier(DATA_SERIALIZED_PROPS),
                    jsxExpressionContainer(identifier('serializedProps'))
                  ),
                ],
                false
              ),
              jsxClosingElement(jsxIdentifier('div')),
              [
                jsxElement(
                  jsxOpeningElement(
                    jsxIdentifier(funcIdentifierName),
                    [jsxSpreadAttribute(identifier('props'))],
                    false
                  ),
                  jsxClosingElement(jsxIdentifier(funcIdentifierName)),
                  []
                ),
              ]
            ),
          ]
        )
      ),
    ])
  )
}

export const transformJsxTags = (contents: string, componentName: string) => {
  const ast = parse(contents, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  if (ast) {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'FunctionDeclaration') {
          const functionId = path.node.declaration.id
          if (!functionId) return
          const originalFunctionId = identifier(functionId.name + 'Original')

          path.insertBefore(
            variableDeclaration('const', [
              variableDeclarator(
                originalFunctionId,
                functionExpression(null, path.node.declaration.params, path.node.declaration.body)
              ),
            ])
          )

          const hocWrapper = wrapWithHOC(originalFunctionId.name, componentName)
          const wrappedFunctionId = identifier('Wrapped' + functionId.name)
          path.replaceWith(
            variableDeclaration('const', [variableDeclarator(wrappedFunctionId, hocWrapper)])
          )
          path.insertAfter(exportDefaultDeclaration(wrappedFunctionId))
        }
      },
    })

    const { code } = generate(ast)
    return code
  }
}

export function islandComponents(): Plugin {
  return {
    name: 'transform-island-components',
    async load(id) {
      const match = id.match(/\/islands\/(.+?\.tsx)$/)
      if (match) {
        const componentName = match[1]
        const contents = await fs.readFile(id, 'utf-8')
        const code = transformJsxTags(contents, componentName)
        if (code) {
          return {
            code,
            map: null,
          }
        }
      }
    },
  }
}
