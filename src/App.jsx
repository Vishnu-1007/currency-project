import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex'>
      <input 
        type="text" 
        className="border border-green-500 rounded px-4 py-2 w-36 m-9 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your text"
      />
      <input 
        type="text" 
        className="border border-green-500 rounded px-4 py-2 w-36 m-9 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your text"
      />
    </div>
  )
}

export default App