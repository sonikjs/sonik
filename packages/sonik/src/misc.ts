import type { AppRoute } from './types'

export const defineRoute = (appRoute: AppRoute) => {
  return {
    APP: appRoute,
  }
}
