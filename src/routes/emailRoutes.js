import express from 'express';
import {
  analyzeEmail,
  addToBlacklist,
  removeFromBlacklist,
  getBlacklist
} from '../controllers/emailController.js';

const router = express.Router();

router.post('/scan', analyzeEmail);
router.get('/settings/blacklist', getBlacklist);
router.post('/settings/blacklist', addToBlacklist);
router.delete('/settings/blacklist/:email', removeFromBlacklist);

export default router;
