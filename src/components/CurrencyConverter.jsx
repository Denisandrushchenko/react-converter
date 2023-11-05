import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(data);
      })
      .catch((error) => {
        console.error('Error fetching currencies:', error);
      });
  }, []);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    const inputAmount = parseFloat(event.target.value);
    setAmount(inputAmount);

    if (!isNaN(inputAmount) && inputAmount > 0) {
      const exchangeRate = currencies.find((currency) => currency.cc === fromCurrency)?.rate;
      if (exchangeRate) {
        setConvertedAmount(inputAmount * exchangeRate);
      }
    } else {
      setConvertedAmount(null);
    }
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="currency-converter" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Currency Converter</h2>
      <p style={{ textAlign: 'center' }}>{new Date().toLocaleDateString()}</p>
      <div>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency.cc} value={currency.cc}>
              {currency.txt}
            </option>
          ))}
        </select>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <select value={toCurrency} onChange={handleSwapCurrencies}>
          {currencies.map((currency) => (
            <option key={currency.cc} value={currency.cc}>
              {currency.txt}
            </option>
          ))}
        </select>
        <span>Converted Amount: {convertedAmount ? convertedAmount.toFixed(2) : '0'}</span>
      </div>
    </div>
  );
};

export default CurrencyConverter;