/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '../../../src/presets/preact/client'

createClient({
  ISLAND_FILES: import.meta.glob('./islands/**/[a-zA-Z0-9[-]+.(tsx|ts)'),
  island_root: './islands/',
})
