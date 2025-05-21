//endpoint of: get, post, search and delete

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h2>Welcome to the Home Page</h2>');
});

router.get('/status', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

export default router;