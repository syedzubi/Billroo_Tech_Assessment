import express from 'express';
import pool from '../database'; // Adjust the path as necessary

const router = express.Router();

// Fetch all expenses
router.get('/', async (req, res) => {
  try {
    const [expenses] = await pool.query('SELECT * FROM expenses');
    res.json(expenses);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

export default router;
