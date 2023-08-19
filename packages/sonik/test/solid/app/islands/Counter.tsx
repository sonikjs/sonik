import { createSignal } from 'solid-js'

export default function Counter({ initial }: { initial: number }) {
  const [count, setCount] = createSignal(initial)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  )
}
