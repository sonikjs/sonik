/* eslint-disable @typescript-eslint/no-explicit-any */

/** JSX */
export type CreateElement = (type: any, props: any, ...children: any[]) => Node
export type Hydrate = (children: Node, parent: Element) => void
