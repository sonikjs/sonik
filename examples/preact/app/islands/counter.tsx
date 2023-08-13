import { useState } from 'preact/hooks'

export default function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </>
  )
}
