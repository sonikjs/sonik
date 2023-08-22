# Sonik

Sonik is a simple and fast -_supersonic_- meta framework for creating websites with Server-Side Rendering. It stands on the shoulders of giants; built on [Hono](https://hono.dev), [Vite](https://vitejs.dev), and JSX-based UI libraries.

**Note:** _Sonik is currently a work in progress. There will be breaking changes without any announcement. Don't use it in production. However, feel free to try it in your hobby project and give us your feedback!_

## Features

- **File-based routing** - It's similar to Next.js.
- **Fast SSR** - Supports only Server-Side Rendering. Rendering is ultra-fast thanks to Hono.
- **No JavaScript** - By default, there's no need for JavaScript. Nothing loads.
- **Island hydration** - If you want interaction, create an island. JavaScript is hydrated only for that island.
- **UI presets** - Any JSX-based UI library works with Sonik. Presets for hono/jsx, Preact, React, and Solid are available.
- **Easy API creation** - You can create APIs using Hono's syntax.
- **Middleware** - It works just like Hono, so you can use many of Hono's middleware.
- **Edge optimized** - The bundle size is minimized, making it easy to deploy to edge platforms like Cloudflare Workers.

## Quick Start

### Getting the basic template

Give it a try:

```plain
npx degit yusukebe/sonik/examples/basic my-app
cd my-app
```

### Usage

_By default, it can be deployed to Cloudflare Pages._

npm:

```plain
npm install
npm run dev
npm run build
npm run deploy
```

yarn:

```plain
yarn install
yarn dev
yarn build
yarn deploy
```

### Getting other presets

Preact:

```plain
npx degit yusukebe/sonik/examples/preact preact-app
cd preact-app
```

React:

```plain
npx degit yusukebe/sonik/examples/react react-app
cd react-app
```

Solid:

```plain
npx degit yusukebe/sonik/examples/solid solid-app
cd solid-app
```

## Project Structure

Below is a typical project structure for a Sonik application with Islands.

```plain
.
├── app
│   ├── client.ts // client entry file
│   ├── islands
│   │   └── counter.tsx // island component
│   ├── routes
│   │   ├── _404.tsx // not found page
│   │   ├── _error.tsx // error page
│   │   ├── _layout.tsx // layout template
│   │   ├── about
│   │   │   └── [name].tsx // matches `/about/:name`
│   │   └── index.tsx // matches `/`
│   ├── server.ts // server entry file
│   └── style.css
├── package.json
├── public
│   └── favicon.ico
├── tsconfig.json
└── vite.config.ts
```

## Building Your Application

### Server Entry File

A server entry file is required. The file is should be placed at `src/server.ts`.
This file is first called by the Vite during the development or build phase.

In the entry file, simply initialize your app using the `createApp()` function. `app` will be an instance of Hono, so you can utilize Hono's middleware and the `app.showRoutes()` feature.

```ts
// app/server.ts
import { createApp } from 'sonik'

const app = createApp()

app.showRoutes()

export default app
```

### Presets

You can construct pages with the JSX syntax using your favorite UI framework. Presets for hono/jsx, Preact, React, and Solid are available.

If you prefer to use the Preact presets, simply import from `sonik/preact`:

```ts
import { createApp } from 'sonik/preact'
```

The following presets are available:

- `sonik` - hono/jsx
- `sonik/preact` - Preact
- `sonik/react` - React
- `sonik/solid` - Solid

### Pages

There are two syntaxes for creating a page.

#### `Route` Component

Export the `Route` typed object as the default.

```ts
// app/about/[name].tsx
import type { Route } from 'sonik'

export default {
  GET: (c, { head }) => {
    const name = c.req.param('name')
    head.title = `About ${name}`
    return <h2>It's {name}!</h2>
  },
} satisfies Route
```

`Route` definition:

```ts
type Route = {
  [Key in Methods]: (
    c: Context,
    props: {
      head: Head
      next: Next
    }
  ) => Node | Promise<Node> | Response | Promise<Response> | Promise<Response | Node>
} & {
  APP: {
    app: Hono
    props: {
      head: Head
      render: (node: Node, status?: number) => Response | Promise<Response>
    }
  }
}
```

`Context` is a Hono's `Context` object.

#### Function component

Just return JSX function:

```ts
// app/index.tsx
export default function Home() {
  return <h1>Welcome!</h1>
}
```

### Creating API

You can write the API endpoints in the same syntax as Hono.

```ts
// app/routes/about/index.ts
import { Hono } from 'hono'

const app = new Hono()

// matches `/about/:name`
app.get('/:name', (c) => {
  const name = c.req.param('name')
  return c.json({
    'your name is': name,
  })
})

export default app
```

### Reserved Files

Files named in the following manner have designated roles:

- `_404.tsx` - Not found page
- `_error.tsx` - Error page
- `_layout.tsx` - Layout template
- `__layout.tsx` - Template for nested layouts

### Client

To write client-side scripts that include JavaScript or stylesheets managed by Vite, craft a file and import `sonik/client` as seen in `app/client.ts`:

```ts
import { createClient } from 'sonik/preact/client'

createClient()
```

Also presets are avialbles for client entry file:

- `sonik/preact/client` - Preact
- `sonik/react/client` - React
- `sonik/solid/client` - Solid

And then, import it in `app/routes/_layout.tsx`:

```tsx
import type { LayoutHandler } from 'sonik/preact'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {import.meta.env.PROD ? (
          <>
            <link href='/static/style.css' rel='stylesheet' />
            <script type='module' src='/static/client.js'></script>
          </>
        ) : (
          <>
            <link href='/app/style.css' rel='stylesheet' />
            <script type='module' src='/app/client.ts'></script>
          </>
        )}
        {head.createTags()}
      </head>
      <body>
        <div class='bg-gray-200 h-screen'>{children}</div>
      </body>
    </html>
  )
}

export default handler
```

`import.meta.env.PROD` is useful flag for separate tags wehere it is on dev server or production.
You should use `/app/client.ts` in development and use the file built in the production.

### Using Middleware

Given that a Sonik instance is fundamentally a Hono instance, you can utilize all of Hono's middleware. If you wish to apply it before the Sonik app processes a request, create a `base` variable and pass it as a constructor option for `createApp()`:

```ts
const base = new Hono()
base.use('*', poweredBy())

const app = createApp({
  app: base,
})
```

### Using Tailwind CSS

Given that Sonik is Vite-centric, if you wish to utilize Tailwind CSS, simply adhere to the official instructions.

Prepare `tailwind.config.js` and `postcss.config.js`:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Write `app/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Finally, import it in client entry file:

```ts
//app/client.ts
import { createClient } from 'sonik/preact/client'
import './style.css'

createClient()
```

### Using MDX

Integrate MDX using `@mdx-js/rollup` by configuring it in `vite.config.ts`:

```ts
import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite'
import sonik from 'sonik/vite'

export default defineConfig({
  plugins: [
    sonik({
      entry: './app/server.ts',
    }),
    {
      ...mdx({
        jsxImportSource: 'preact',
      }),
    },
  ],
})
```

### SSR Streaming

Sonik supports SSR Streaming, which, as of now, is exclusively available for React with `Suspense`.

To enable is, set the `streaming` as `true` and pass the `renderToReadableString()` method in the `createApp()`:

```ts
import { renderToReadableStream } from 'react-dom/server'

const app = createApp({
  streaming: true,
  renderToReadableStream: renderToReadableStream,
})
```

## Deployment

Since a Sonik instance is essentially a Hono instance, it can be deployed on any platform that Hono supports.

The following adapters for deploying to the platforms are available in the Sonik package.

### Cloudflare Pages

Setup the `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import pages from 'sonik/cloudflare-pages'

export default defineConfig({
  plugins: [sonik(), pages()],
})
```

Build command (including a client):

```plain
vite build && vite build --mode client
```

Deploy with the following commands after build. Ensure you have [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed:

```plain
wrangler pages deploy ./dist
```

### Vercel

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import vercel from 'sonik/vercel'

export default defineConfig({
  plugins: [sonik(), vercel()],
})
```

Build command (including a client):

```plain
vite build && vite build --mode client
```

Ensure you have [Vercel CLI](https://vercel.com/docs/cli) installed.

```plain
vercel --prebuilt
```

### Cloudflare Workers

_The Cloudflare Workers adapter supports the "server" only and does not support the "client"._

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import sonik from 'sonik/vite'
import workers from 'sonik/cloudflare-workers'

export default defineConfig({
  plugins: [sonik(), workers()],
})
```

Build command:

```plain
vite build
```

Deploy command:

```plain
wrangler deploy --compatibility-date 2023-08-01 --minify ./dist/index.js --name my-app
```

## Examples

- [Sonik Blog](https://github.com/yusukebe/sonik-blog)

## Related projects

- [Hono](https://hono.dev)
- [Vite](https://vitejs.dev/)

## Authors

- Yusuke Wada <https://github.com/yusukebe>

## License

MIT
