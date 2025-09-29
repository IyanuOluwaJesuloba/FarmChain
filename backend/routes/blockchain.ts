import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get blockchain status
router.get('/status', async (req, res) => {
  try {
    const { provider } = req.app.locals;
    if (!provider) {
      return res.status(503).json({ error: 'Blockchain not connected' });
    }
    
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    res.json({
      connected: true,
      network: network.name,
      chainId: network.chainId,
      blockNumber
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blockchain status' });
  }
});

// Submit transaction to blockchain
router.post('/transaction', authenticateToken, async (req, res) => {
  try {
    // Placeholder for blockchain transactions
    res.status(201).json({ message: 'Blockchain transaction - coming soon' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit transaction' });
  }
});

export default router;
