import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

// Route imports
import farmerRoutes from './routes/farmers';
import cropRoutes from './routes/crops';
import marketplaceRoutes from './routes/marketplace';
import loanRoutes from './routes/loans';
import weatherRoutes from './routes/weather';
import blockchainRoutes from './routes/blockchain';
import authRoutes from './routes/auth';

// Middleware imports
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';
import { validateBlockchainConnection } from './middleware/blockchain';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Blockchain provider setup
let provider: ethers.JsonRpcProvider | undefined;
let signer: ethers.Wallet | undefined;

if (process.env.POLYGON_RPC_URL) {
  provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  
  if (process.env.PRIVATE_KEY) {
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }
}

// Make blockchain instances available to routes
app.locals.provider = provider;
app.locals.signer = signer;

// Extend Express Application interface
declare global {
  namespace Express {
    interface Application {
      locals: {
        provider?: ethers.JsonRpcProvider;
        signer?: ethers.Wallet;
      };
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    blockchain: provider ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/blockchain', validateBlockchainConnection, blockchainRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmchain-nigeria';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Test blockchain connection
    if (provider) {
      try {
        const network = await provider.getNetwork();
        console.log(`✅ Connected to blockchain network: ${network.name} (${network.chainId})`);
      } catch (error) {
        console.warn('⚠️ Blockchain connection failed:', error);
      }
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close().then(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  }).catch((err) => {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  });
});

startServer();

export default app;