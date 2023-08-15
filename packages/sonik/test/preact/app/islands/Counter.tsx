import { useState } from 'preact/hooks'

export default function Counter({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial)
  const increment = () => setCount(count + 1)

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </>
  )
}
