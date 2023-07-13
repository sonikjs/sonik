import type { LayoutHandler } from 'sonik'

const handler: LayoutHandler = (children) => {
  return (
    <div>
      <nav>Sub Menu</nav>
      {children}
    </div>
  )
}

export default handler
