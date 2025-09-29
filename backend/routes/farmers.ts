import express from 'express';
import { Farmer } from '../models/Farmer';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all farmers
router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find({ isActive: true });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Get farmer by ID
router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmer' });
  }
});

// Create new farmer
router.post('/', async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create farmer' });
  }
});

// Update farmer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update farmer' });
  }
});

export default router;
