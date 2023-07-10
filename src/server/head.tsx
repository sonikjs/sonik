/** @jsx h */
/** @jsxFragment Fragment */
import { h, Fragment } from 'preact'
import type { Head } from '../types'

export const createHeadTags = (head?: Head) => {
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
    </Fragment>
  )
}
