import express, { Request, Response } from 'express';
import pool from './database';
import {RowDataPacket } from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 3001; // You can choose any available port

app.use(cors());
app.use(express.json());

//Fetch expense_types from today 
app.get('/api/expenses/check-today', async (req: Request, res: Response) => {
  const userId = 101010; // Assuming static user ID for simplicity
  const today = new Date().toISOString().slice(0, 10);
  
  try {
    // First, check if there's any expense of the specified type for today
    const [expensesForTypeToday] = await pool.query(
      'SELECT * FROM expenses WHERE user_id = ?  AND date = ?',
      [userId, today]
    ) as [RowDataPacket[], any];
    
    // If there are any expenses of the specified type for today, fetch all expenses for today
    if (expensesForTypeToday.length > 0) {
      const [allExpensesForToday] = await pool.query(
        'SELECT * FROM expenses WHERE user_id = ? AND date = ?',
        [userId, today]
      ) as [RowDataPacket[], any];
      
      res.json(allExpensesForToday);
    } else {
      res.status(404).json({ message: 'No expenses found for the specified type for today' });
    }
  } catch (error) {
    console.error('Failed to check expenses:', error);
    res.status(500).json({ message: 'Error checking expenses' });
  }
});

//Fetch all expenses
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const [expenses] = await pool.query('SELECT * FROM expenses WHERE user_id = ?', [101010]); // Assuming static user ID
    res.json(expenses);
  } catch (error) {
    console.error('Failed to retrieve expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses from the database' });
  }
});

// Fetch expense summary
app.get('/api/expenses/summary', async (req: Request, res: Response) => {
  try {
    // Execute the query and explicitly declare the type of the result.
    const [rows] = await pool.query(`
    SELECT DISTINCT
    expense_type,
    FIRST_VALUE(amount) OVER (PARTITION BY expense_type ORDER BY date DESC, id DESC) AS recent_amount,
    AVG(amount) OVER (PARTITION BY expense_type) AS average_amount
FROM expenses
WHERE user_id = 101010 AND date > DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY expense_type, date, id;
    `, [101010]) as [RowDataPacket[], any]; // Cast the result to the expected type

    // Map over the result to format the average_amount.
    const summary = rows.map((item: any) => ({
      expense_type: item.expense_type,
      average_amount: parseFloat(item.average_amount).toFixed(6),
      recent_amount: item.recent_amount
    }));

    res.json(summary);
  } catch (error) {
    console.error('Failed to fetch expense summary:', error);
    res.status(500).json({ message: 'Error fetching expense summary' });
  }
});

// Add new expense(s)
app.post('/api/expenses', async (req: Request, res: Response) => {
  const expenses = req.body; // Expecting an array of expenses
  const userId = 101010; // Assuming static user ID for simplicity
  const today = new Date().toISOString().slice(0, 10);
  
  try {
    for (const expense of expenses) {
      const { expense_type, amount } = expense;
      
      // First, check if an expense of the same type already exists for today
      const [existing] = await pool.query(
        'SELECT * FROM expenses WHERE user_id = ? AND expense_type = ? AND date = ?',
        [userId, expense_type, today]
      ) as [RowDataPacket[], any];

      if (existing.length > 0) {
        await pool.query(
          'UPDATE expenses SET amount = ? WHERE user_id = ? AND expense_type = ? AND date = ?',
          [amount, userId, expense_type, today]
        );
      } else {
        await pool.query(
          'INSERT INTO expenses (user_id, date, expense_type, amount) VALUES (?, ?, ?, ?)',
          [userId, today, expense_type, amount]
        );
      }
    }
    
    res.status(201).json({ message: 'Expenses processed successfully' });
  } catch (error) {
    console.error('Failed to process expenses:', error);
    res.status(500).json({ message: 'Error processing expenses' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});