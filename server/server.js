const express = require('express');
const app = express();
const exchangeRateRoutes = require('./routes/exchangeRoute');
const transactionRoute = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoute')

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


// ... other middleware and routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));