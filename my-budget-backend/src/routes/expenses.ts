import express from 'express';
import * as expensesController from '../controllers/expenses';

const router = express.Router();

router.get('/check-today', expensesController.getExpensesForToday);
router.get('/', expensesController.getAllExpenses);
router.get('/summary', expensesController.getExpenseSummary);
router.post('/', expensesController.addExpense);

export default router;