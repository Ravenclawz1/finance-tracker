const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection URI
const MONGO_URL = 'mongodb+srv://test2:1lCMyRy75k6B2AfV@cluster1.0ffpk0m.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=cluster1';

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// MongoDB Connection Manager
class MongoDBConnection {
  static instance = null;

  constructor() {
    if (MongoDBConnection.instance) {
      return MongoDBConnection.instance;
    }
    MongoDBConnection.instance = this;
    this.mongoose = mongoose;
  }

  async connect() {
    try {
      if (this.mongoose.connection.readyState === 1) {
        return;
      }
      await this.mongoose.connect(MONGO_URL);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Connection Error:', error.stack);
      throw error;
    }
  }
}

// Transaction Service
class TransactionService {
  constructor() {
    this.Transaction = mongoose.model('Transaction', transactionSchema);
    this.db = new MongoDBConnection();
  }

  async createTransaction(transactionData) {
    try {
      await this.db.connect();
      console.log('Attempting to create transaction:', transactionData);
      const transaction = await this.Transaction.create(transactionData);
      return {
        success: true,
        data: transaction,
        message: 'Transaction created successfully'
      };
    } catch (error) {
      console.error('Create transaction error:', error.stack);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create transaction'
      };
    }
  }

  async getAllTransactions() {
    try {
      await this.db.connect();
      console.log('Fetching all transactions');
      const transactions = await this.Transaction.find().sort({ date: -1 });
      return {
        success: true,
        data: transactions,
        message: 'Transactions retrieved successfully'
      };
    } catch (error) {
      console.error('Get transactions error:', error.stack);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve transactions'
      };
    }
  }

  async getAlerts() {
    try {
      await this.db.connect();
      console.log('Fetching transactions for alerts');
      const transactions = await this.Transaction.find();

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const rent = transactions
        .filter(t => t.category.toLowerCase() === 'rent')
        .reduce((sum, t) => sum + t.amount, 0);

      const alerts = [];

      if (totalIncome > 0 && rent > 0.5 * totalIncome) {
        alerts.push('⚠️ Rent is more than 50% of your income.');
      }

      return {
        success: true,
        data: { alerts },
        message: 'Alerts retrieved successfully'
      };
    } catch (error) {
      console.error('Get alerts error:', error.stack);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve alerts'
      };
    }
  }
}

// API Server
class TransactionAPI {
  constructor() {
    this.app = express();
    this.transactionService = new TransactionService();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // POST endpoint for creating transactions
    this.app.post('/api/transactions', async (req, res) => {
      console.log('Received POST request with body:', req.body);
      const transactionData = req.body;
      const requiredFields = ['type', 'amount', 'category'];

      // Validate input
      for (const field of requiredFields) {
        if (!transactionData[field]) {
          console.log(`Missing field: ${field}`);
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`,
            message: 'Invalid transaction data'
          });
        }
      }

      const result = await this.transactionService.createTransaction(transactionData);
      console.log('Create transaction result:', result);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    });

    // GET endpoint for retrieving all transactions
    this.app.get('/api/transactions', async (req, res) => {
      console.log('Received GET request for transactions');
      const result = await this.transactionService.getAllTransactions();
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    });

    // GET endpoint for retrieving alerts
    this.app.get('/api/alerts', async (req, res) => {
      console.log('Received GET request for alerts');
      const result = await this.transactionService.getAlerts();
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  }
}

// Start the server
const api = new TransactionAPI();
api.start(3000);

module.exports = { TransactionAPI, MongoDBConnection, TransactionService };