/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp } from '../../../src/presets/preact'

const ROUTES = import.meta.glob('./routes/**/[a-z[-][a-z[_-]*.(tsx|ts)', {
  eager: true,
})

const PRESERVED = import.meta.glob('./routes/(_error|_404).tsx', {
  eager: true,
})

const LAYOUTS = import.meta.glob('./routes/**/_layout.tsx', {
  eager: true,
})

const app = createApp({
  root: './routes',
  ROUTES: ROUTES as any,
  PRESERVED: PRESERVED as any,
  LAYOUTS: LAYOUTS as any,
})

export default app
