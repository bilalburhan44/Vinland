const express = require('express');
const app = express();
const exchangeRateRoutes = require('./routes/exchangeRoute');
const transactionRoute = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoute');
const walletRoutes = require('./routes/walletRoutes');
const conversionRoute = require('./routes/conversionRoute');
const dailyTotalRoute = require('./routes/dailyTotalRoute');

require('./models/syncModel'); // Ensure models are synced

app.use(express.json());
const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'https://main--vinlandkitchen.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};


// Middleware and other routes
app.use('/api/exchangeRate', exchangeRateRoutes);
app.use('/api/transactions', transactionRoute);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/conversion', conversionRoute);
app.use('/api/dailyTotal', dailyTotalRoute);

// Deploy config for serving static files (if applicable)
const path = require('path');
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
