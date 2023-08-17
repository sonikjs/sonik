/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

export const sonikify = <P extends {}>(
  comp: (p: P) => JSX.Element,
  componentName?: string
): ((props: P & { children?: JSX.Element }) => JSX.Element) => {
  return (arg: P) => {
    if (import.meta.env.SSR) {
      const inner = { __html: renderToString(createElement(comp as any, arg)) }
      const Div = (
        <div
          component-name={componentName}
          data-serialized-props={JSON.stringify(arg)}
          dangerouslySetInnerHTML={inner}
        ></div>
      )
      return Div as any
    }
    return comp
  }
}
