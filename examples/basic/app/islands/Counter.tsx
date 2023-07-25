import { useSignal } from '@preact/signals'

export default function Counter() {
  const count = useSignal(0)
  const increment = () => {
    count.value++
  }
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
