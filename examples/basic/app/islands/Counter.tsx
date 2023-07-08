import { useSignal } from '@preact/signals'
import styles from './Counter.module.css'

export default function Counter() {
  const count = useSignal(0)
  const increment = () => {
    count.value++
  }
  return (
    <div>
      <p>Counter: {count}</p>
      <button class={styles.count} onClick={increment}>
        Increment
      </button>
    </div>
  )
}
