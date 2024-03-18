import { Request, Response } from 'express';
import pool from '../db';
import {RowDataPacket } from 'mysql2';
import { queries } from '../db/queries/expensesQueries';

export const getExpensesForToday = async (req: Request, res: Response) => {
  try {
    const userId = 101010;
    const today = new Date().toISOString().slice(0, 10);
    const [expensesForTypeToday] = await pool.query(queries.getExpensesForToday, [userId, today]) as [RowDataPacket[], any];

    if (expensesForTypeToday.length > 0) {
      res.json(expensesForTypeToday);
    } else {
      res.status(404).json({ message: 'No expenses found for today.' });
    }
  } catch (error) {
    console.error('Failed to check expenses:', error);
    res.status(500).json({ message: 'Error checking expenses' });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const userId = 101010; // Static user ID
    const [expenses] = await pool.query(queries.getAllExpenses, [userId]) as [RowDataPacket[], any];
    res.json(expenses);
  } catch (error) {
    console.error('Failed to retrieve expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

export const getExpenseSummary = async (req: Request, res: Response) => {
  try {
    const userId = 101010; // Static user ID for simplicity
    const [rows] = await pool.query(queries.getExpenseSummary, [userId]) as [RowDataPacket[], any];

    const summary = rows.map((item: any) => ({
      expense_type: item.expense_type,
      average_amount: parseFloat(item.average_amount).toFixed(2), // Adjusted for simplicity
      recent_amount: item.recent_amount
    }));

    res.json(summary);
  } catch (error) {
    console.error('Failed to fetch expense summary:', error);
    res.status(500).json({ message: 'Error fetching expense summary' });
  }
};


export const addExpense = async (req: Request, res: Response) => {
  const expenses = req.body; // Expecting an array of expenses
  const userId = 101010; // Assuming static user ID for simplicity
  const today = new Date().toISOString().slice(0, 10);
  
  try {
    await Promise.all(expenses.map(async (expense: { expense_type: string; amount: number }) => {
      const { expense_type, amount } = expense;
      
      const [existing] = await pool.query(queries.checkExistingExpense, [userId, expense_type, today]) as [RowDataPacket[], any];

      if (existing.length > 0) {
        await pool.query(queries.updateExpense, [amount, userId, expense_type, today]);
      } else {
        await pool.query(queries.addExpense, [userId, today, expense_type, amount]);
      }
    }));

    res.status(201).json({ message: 'Expenses processed successfully' });
  } catch (error) {
    console.error('Failed to process expenses:', error);
    res.status(500).json({ message: 'Error processing expenses' });
  }
};

