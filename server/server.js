const express = require('express');
const app = express();
const exchangeRateRoutes = require('./routes/exchangeRoute');
const transactionRoute = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoute')
const walletRoutes = require('./routes/walletRoutes')
require('./models/syncModel')

app.use(express.json());
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Set the correct origin
    methods: ['GET', 'POST'],
    credentials: true,
  }));

// Middleware and other routes
app.use('/api/exchange-rate', exchangeRateRoutes);
app.use('/api/transactions', transactionRoute);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/wallet', walletRoutes);

//deploy config
const path = require('path');
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
