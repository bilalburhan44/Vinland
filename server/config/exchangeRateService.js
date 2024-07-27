const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const ExchangeRate = require('../models/exchangeRatemodel');

// Initialize the bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Bot started, waiting for messages...');

bot.on('message', async (msg) => {
  const messageText = msg.text.trim(); // Trim whitespace from the message
  console.log('Received a message:', JSON.stringify(msg, null, 2));

  // Extract exchange rate from the message
  const exchangeRate = extractExchangeRate(messageText);
  console.log('Extracted exchange rate:', exchangeRate);

  if (exchangeRate !== null) { // Check for strict null
    try {
      // Create a new exchange rate entry
      const newExchangeRate = await ExchangeRate.create({ rate: exchangeRate });
      console.log('Created new exchange rate entry in database:', newExchangeRate.rate);
    } catch (error) {
      console.error('Error creating new exchange rate:', error.message);
    }
  } else {
    console.error('Invalid message format or exchange rate not found:', messageText);
  }
});

const extractExchangeRate = (message) => {
  const regex = /\$?\d*=([\d,]+)/; // Regex to match optional $100=150000 format or just 150000
  const match = message.match(regex);
  return match ? parseFloat(match[1].replace(/,/g, '')) : null; // Return the captured rate part, remove commas, and convert to float
};

module.exports = bot;
