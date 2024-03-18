import { Request, Response } from 'express';
import pool from '../../db';
import { getAllExpenses, getExpensesForToday, getExpenseSummary, addExpense } from '../../controllers/expenses';

jest.mock('../../db', () => ({ 
  query: jest.fn()
}));

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Expenses Controller', () => {
  
  it('getAllExpenses sends correct response', async () => {
    const req: Partial<Request> = {};
    const res = mockResponse();

    // Mocking pool.query to return a fake expenses list
    (pool.query as jest.Mock).mockResolvedValueOnce([
      [{ id: 1, user_id: 101010, expense_type: 'coffee', amount: 3.50 }]
    ]);

    await getAllExpenses(req as Request, res);

    // Asserting response
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, user_id: 101010, expense_type: 'coffee', amount: 3.50 },
    ]);
  });

  it('getExpensesForToday sends correct response', async () => {
    const req: Partial<Request> = {};
    const res = mockResponse();

    (pool.query as jest.Mock).mockResolvedValueOnce([
      [{ id: 2, user_id: 101010, expense_type: 'coffee', amount: 4.00, date: new Date().toISOString().slice(0, 10) }]
    ]);

    await getExpensesForToday(req as Request, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 2, user_id: 101010, expense_type: 'coffee', amount: 4.00, date: new Date().toISOString().slice(0, 10) }
    ]);
  });

  it('getExpenseSummary sends correct response', async () => {
    const req: Partial<Request> = {};
    const res = mockResponse();

    (pool.query as jest.Mock).mockResolvedValueOnce([
      [{ expense_type: 'coffee', recent_amount: '4.00', average_amount: '3.75' }]
    ]);

    await getExpenseSummary(req as Request, res);

    expect(res.json).toHaveBeenCalledWith([
      { expense_type: 'coffee', recent_amount: '4.00', average_amount: '3.75' }
    ]);
  });

  it('addExpense processes successfully', async () => {
    const req: Partial<Request> = { body: [{ expense_type: 'coffee', amount: 5.00 }] };
    const res = mockResponse();

    // Mock to simulate no existing expense for today, triggering an insert
    (pool.query as jest.Mock)
      .mockResolvedValueOnce([[]]) // Check for existing expense
      .mockResolvedValueOnce([{}]); // Insert new expense

    await addExpense(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Expenses processed successfully' });
  });
});