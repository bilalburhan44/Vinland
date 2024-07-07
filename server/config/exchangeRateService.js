const axios = require('axios');
require('dotenv').config();

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
      const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=835c2388d8bb4c23875402aeaa2481fd`);
      const rate = response.data.rates[fromCurrency] / response.data.rates[toCurrency];
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw new Error('Could not fetch exchange rate');
    }
  };

module.exports = { getExchangeRate };