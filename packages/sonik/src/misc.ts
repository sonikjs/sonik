import type { Env } from 'hono'
import type { AppRoute } from './types'

export const defineRoute = <E extends Env = Env>(appRoute: AppRoute<E>) => {
  return {
    APP: appRoute,
  }
}
