import { useState } from 'react'
import './index.css'

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [result, setResult] = useState(null)

  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value)
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value)
  const handleClear = () => {
    setAmount('')
    setFromCurrency('')
    setToCurrency('')
    setResult(null)
  }

  const handleCalculate = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
      const data = await response.json()
      setResult(data.convertedAmount)
    } catch (error) {
      console.error('Error fetching conversion:', error)
      alert('Failed to fetch conversion')
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-2xl font-bold my-4">Currency Converter</h1>
      <input 
        type="number" 
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
        placeholder="From Currency (USD)"
      />
      <input 
        type="text" 
        value={toCurrency}
        onChange={handleToCurrencyChange}
        className="border border-green-500 rounded px-4 py-2 w-36 m-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="To Currency (EUR)"
      />
      <div className="flex space-x-4">
        <button 
          onClick={handleCalculate}
          className='bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Calculate
        </button>
        <button 
          onClick={handleClear}
          className='bg-gray-500 text-white font-bold py-2 px-4 rounded m-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
        >
          Clear
        </button>
      </div>
      {result !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
          <span className="font-bold">Converted Amount:</span> {result.toFixed(2)} {toCurrency}
        </div>
      )}
    </div>
  )
}

export default App