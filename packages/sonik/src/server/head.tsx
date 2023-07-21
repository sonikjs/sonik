/** @jsx h */
/** @jsxFragment Fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment } from 'preact'
import type { Head } from '../types'

export const createHeadTag = (head?: Head) => {
  return (
    <Fragment>
      {head && head.title ? <title>{head.title}</title> : <Fragment />}
      {head && head.meta ? (
        head.meta.map((attr) => {
          return <meta {...attr} />
        })
      ) : (
        <Fragment></Fragment>
      )}
      {head && head.link ? (
        head.link.map((attr) => {
          return <link {...attr} />
        })
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  )
}
