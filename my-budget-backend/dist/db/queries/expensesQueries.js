"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = {
    getAllExpenses: 'SELECT * FROM expenses WHERE user_id = ?',
    getExpensesForToday: 'SELECT * FROM expenses WHERE user_id = ? AND date = ?',
    getExpenseSummary: `
    SELECT DISTINCT
    expense_type,
    FIRST_VALUE(amount) OVER (PARTITION BY expense_type ORDER BY date DESC, id DESC) AS recent_amount,
    AVG(amount) OVER (PARTITION BY expense_type) AS average_amount
    FROM expenses
    WHERE user_id = ? AND date > DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY expense_type, date, id;
  `,
    checkExistingExpense: 'SELECT * FROM expenses WHERE user_id = ? AND expense_type = ? AND date = ?',
    updateExpense: 'UPDATE expenses SET amount = ? WHERE user_id = ? AND expense_type = ? AND date = ?',
    addExpense: 'INSERT INTO expenses (user_id, date, expense_type, amount) VALUES (?, ?, ?, ?)',
};
