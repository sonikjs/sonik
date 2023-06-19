import { useSignal } from '@preact/signals'
import Header from '../../islands/fresh/Header'
import AddToCart from '../../islands/fresh/AddToCart'

export default function Page() {
  const cart = useSignal<string[]>([])
  return (
    <div>
      <Header cart={cart} />
      <div>
        <h1>Orange</h1>
        <p>A very fresh fruit.</p>
        <AddToCart cart={cart} id='lemon' />
      </div>
    </div>
  )
}
