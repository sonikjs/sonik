import type { Signal } from '@preact/signals'

export default function Header(props: { cart: Signal<string[]> }) {
  return (
    <header>
      <span>Fruit Store</span>
      <button>Open cart ({props.cart.value.length})</button>
    </header>
  )
}
