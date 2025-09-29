import express from 'express';
import { Crop } from '../models/Crop';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find({ isActive: true }).populate('farmerId', 'name location.state');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// Get crop by ID
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmerId');
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crop' });
  }
});

// Create new crop
router.post('/', authenticateToken, async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create crop' });
  }
});

// Update crop status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    
    await crop.updateStatus(status, notes, req.user?.id);
    res.json(crop);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update crop status' });
  }
});

export default router;
