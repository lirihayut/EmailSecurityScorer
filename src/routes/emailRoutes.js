import express from 'express';
import {
  analyzeEmail,
  addToBlacklist,
  removeFromBlacklist
} from '../controllers/emailController.js';

const router = express.Router();

router.post('/scan', analyzeEmail);
router.post('/settings/blacklist', addToBlacklist);
router.delete('/settings/blacklist/:email', removeFromBlacklist);

export default router;
