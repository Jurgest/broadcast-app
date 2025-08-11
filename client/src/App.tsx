import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Cross-Tab Collaboration Dashboard</h1>
      <p>A real-time collaboration app for multiple browser tabs</p>
      
      <div style={{ margin: '2rem 0' }}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      
      <p>
        Built with React + TypeScript + Vite
      </p>
    </div>
  )
}

export default App
