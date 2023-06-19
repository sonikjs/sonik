import { Signal } from '@preact/signals'

export default function AddToCart(props: { cart: Signal<string[]>; id: string }) {
  function add() {
    props.cart.value = [...props.cart.value, props.id]
  }
  return <button onClick={add}>Add to cart</button>
}
