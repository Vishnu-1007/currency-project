import { useState } from 'react'
import './index.css'

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [result, setResult] = useState(null)
  const [clear,setClear] = useState('')

  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value)
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value)

  const handleCalculate = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
      const data = await response.json()
      setResult(data.convertedAmount)
    } catch (error) {
      console.error('Error fetching conversion:', error)
      alert('Failed to fetch conversion')
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <input 
        type="text" 
        value={amount}
        onChange={handleAmountChange}
        className="border border-green-500 rounded px-4 py-2 w-36 m-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Amount"
      />
      <input 
        type="text" 
        value={fromCurrency}
        onChange={handleFromCurrencyChange}
        className="border border-green-500 rounded px-4 py-2 w-36 m-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="From Currency"
      />
      <input 
        type="text" 
        value={toCurrency}
        onChange={handleToCurrencyChange}
        className="border border-green-500 rounded px-4 py-2 w-36 m-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="To Currency"
      />
      <button 
        onClick={handleCalculate}
        className='bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
      >
        Calculate
      </button>
      <button 
      onClick={setClear}
        className='bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
      >Clear</button>
      {result !== null && (
        <div className="mt-4 text-lg">
          Converted Amount: {result}
        </div>
      )}
    </div>
  )
}

export default App