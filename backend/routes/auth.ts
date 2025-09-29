import express from 'express';
import jwt from 'jsonwebtoken';
import { Farmer } from '../models/Farmer';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature required' });
    }
    
    // Find or create farmer
    let farmer = await Farmer.findByWalletAddress(walletAddress);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found. Please register first.' });
    }
    
    // Update last login
    farmer.lastLoginAt = new Date();
    await farmer.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: farmer._id, walletAddress: farmer.walletAddress },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      farmer: farmer.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const farmerData = req.body;
    
    // Check if farmer already exists
    const existingFarmer = await Farmer.findByWalletAddress(farmerData.walletAddress);
    if (existingFarmer) {
      return res.status(409).json({ error: 'Farmer already registered' });
    }
    
    // Create new farmer
    const farmer = new Farmer(farmerData);
    await farmer.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: farmer._id, walletAddress: farmer.walletAddress },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      farmer: farmer.toPublicJSON()
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const farmer = await Farmer.findById(decoded.id);
    
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    res.json({ farmer: farmer.toPublicJSON() });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
