import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [amountUpdated, setAmountUpdated] = useState('')

  // Fetch available currencies when component mounts
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/currencies')
        const data = await response.json()
        setCurrencies(data.currencies)
        setError(null)
      } catch (err) {
        console.error('Error fetching currencies:', err)
        setError('Failed to load currencies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value)
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value)
  const handleClear = () => {
    setAmount('')
    setFromCurrency('USD')
    setToCurrency('EUR')
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

  const handleAmountUpdated = (e) => {
    setAmountUpdated(amount)
  }

  // Find currency details by code
  const getCurrencyDetails = (code) => {
    console.log(code);
    return currencies.find(currency => currency.code === code) || { code, name: code, symbol: '' }
  }

  // Get from currency details
  const fromCurrencyDetails = getCurrencyDetails(fromCurrency)
  
  // Get to currency details
  const toCurrencyDetails = getCurrencyDetails(toCurrency)

  return (
    <div className='flex flex-col items-center max-w-md mx-auto p-4'>
      <h1 className="text-2xl font-bold my-4">Currency Converter</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="w-full mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <div className="relative">
          {fromCurrencyDetails.symbol && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {fromCurrencyDetails.symbol}
            </span>
          )}
          <input 
            id="amount"
            type="number" 
            value={amount}
            onChange={handleAmountChange}
            className={`border border-green-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${fromCurrencyDetails.symbol ? 'pl-8' : ''}`}
            placeholder="Enter amount"
          />
        </div>
      </div>
      
      <div className="w-full mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fromCurrency">
          From Currency
        </label>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        ) : (
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            className="border border-green-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {currencies.map(currency => (
              <option key={`from-${currency.code}`} value={currency.code}>
                {currency.code} - {currency.name} {currency.symbol}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="w-full mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toCurrency">
          To Currency
        </label>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        ) : (
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={handleToCurrencyChange}
            className="border border-green-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {currencies.map(currency => (
              <option key={`to-${currency.code}`} value={currency.code}>
                {currency.code} - {currency.name} {currency.symbol}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="flex space-x-4 w-full">
        <button 
          onClick={()=>{
            handleCalculate()
            handleAmountUpdated()
          }}
          disabled={loading}
          className='bg-blue-500 text-white font-bold py-2 px-4 rounded flex-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50'
        >
          Calculate
        </button>
        <button 
          onClick={handleClear}
          disabled={loading}
          className='bg-gray-500 text-white font-bold py-2 px-4 rounded flex-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50'
        >
          Clear
        </button>
      </div>
      
      {result !== null && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300 w-full">
          <div className="text-sm text-gray-600 text-center">Converted Amount</div>
          <div className="text-2xl font-bold text-gray-800 text-center">
            {fromCurrencyDetails.symbol}{parseFloat(amountUpdated).toFixed(2)} {fromCurrency} = {toCurrencyDetails.symbol}{result.toFixed(2)} {toCurrency}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Exchange Rate: 1 {fromCurrency} = {(result / parseFloat(amountUpdated)).toFixed(4)} {toCurrency}
          </div>
          <div className="mt-4 text-sm">
            <div className="flex justify-between border-b border-green-200 pb-2 mb-2">
              <span>From:</span>
              <span className="font-medium">{fromCurrencyDetails.symbol} {fromCurrencyDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span>To:</span>
              <span className="font-medium">{toCurrencyDetails.symbol} {toCurrencyDetails.name}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* {!loading && currencies.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full">
          <h3 className="font-bold text-gray-700 mb-2">Available Currencies ({currencies.length})</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {currencies.slice(0, 10).map(currency => (
              <div key={currency.code} className="flex items-center">
                <span className="w-8 text-center">{currency.symbol || currency.code.substring(0, 1)}</span>
                <span className="ml-2">{currency.code}</span>
              </div>
            ))}
            {currencies.length > 10 && (
              <div className="col-span-2 text-center text-gray-500 mt-2">
                And {currencies.length - 10} more...
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  )
}

export default App