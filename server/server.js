const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Import your routes
const exchangeRateRoutes = require('./routes/exchangeRoute');
const transactionRoute = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoute');
const walletRoutes = require('./routes/walletRoutes');
const conversionRoute = require('./routes/conversionRoute');
const dailyTotalRoute = require('./routes/dailyTotalRoute');

// Ensure models are synced
require('./models/syncModel');

// Configure CORS
const corsOptions = {
  origin: 'https://main--vinlandkitchen.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

// Manually handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.path);
  next();
});


// Define your routes
app.use('/api/exchangeRate', exchangeRateRoutes);
app.use('/api/transactions', transactionRoute);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/conversion', conversionRoute);
app.use('/api/dailyTotal', dailyTotalRoute);

// Serve static files in production
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
