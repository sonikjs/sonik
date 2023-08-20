import type { Env } from 'hono'
import type { ReactNode } from 'react'
import { Fragment, createElement } from 'react'
import type { PipeableStream } from 'react-dom/server'
import { renderToString, renderToReadableStream, renderToPipeableStream } from 'react-dom/server'
import { createApp as baseCreateApp } from '../../server/index.js'
import type { ServerOptions } from '../../server/server.js'
import type * as types from '../../types.js'

type Node = ReactNode

async function convertPipeableToReadable(pipeableStream: PipeableStream) {
  const { PassThrough } = await import('node:stream')

  const passThrough = new PassThrough()

  pipeableStream.pipe(passThrough)

  return new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => {
        controller.enqueue(chunk)
      })

      passThrough.on('end', () => {
        controller.close()
      })

      passThrough.on('error', (error) => {
        controller.error(error)
      })
    },
  })
}

export const createApp = <E extends Env = Env>(
  options?: Omit<ServerOptions<E>, 'renderToString' | 'createElement' | 'fragment'>
) => {
  return baseCreateApp<E>({
    renderToString: renderToString,
    renderToReadableStream: (comp) => {
      if (renderToReadableStream) return renderToReadableStream
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return convertPipeableToReadable(renderToPipeableStream(comp)) as any
    },
    createElement: createElement,
    fragment: Fragment,
    ...options,
  })
}

export type Handler<E extends Env = Env> = types.Handler<E, Node>
export type NotFoundHandler<E extends Env = Env> = types.NotFoundHandler<E, Node>
export type ErrorHandler<E extends Env = Env> = types.ErrorHandler<E, Node>
export type LayoutHandler = types.LayoutHandler<Node>
export type FC<E extends Env = Env> = types.FC<E, Node>
export type Route<E extends Env = Env> = types.Route<E, Node>
