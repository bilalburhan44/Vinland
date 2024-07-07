import axios from 'axios';

export const fetchExchangeRate = async () => {
  try {
    const response = await axios.get('http://localhost:5000/exchange-rate/USD/IQD');
    return response.data.rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};