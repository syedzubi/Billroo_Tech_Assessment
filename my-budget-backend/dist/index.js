"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001; // You can choose any available port
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Fetch expense_types from today 
app.get('/api/expenses/check-today', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = 101010; // Assuming static user ID for simplicity
    const today = new Date().toISOString().slice(0, 10);
    try {
        // First, check if there's any expense of the specified type for today
        const [expensesForTypeToday] = yield database_1.default.query('SELECT * FROM expenses WHERE user_id = ?  AND date = ?', [userId, today]);
        // If there are any expenses of the specified type for today, fetch all expenses for today
        if (expensesForTypeToday.length > 0) {
            const [allExpensesForToday] = yield database_1.default.query('SELECT * FROM expenses WHERE user_id = ? AND date = ?', [userId, today]);
            res.json(allExpensesForToday);
        }
        else {
            res.status(404).json({ message: 'No expenses found for the specified type for today' });
        }
    }
    catch (error) {
        console.error('Failed to check expenses:', error);
        res.status(500).json({ message: 'Error checking expenses' });
    }
}));
//Fetch all expenses
app.get('/api/expenses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [expenses] = yield database_1.default.query('SELECT * FROM expenses WHERE user_id = ?', [101010]); // Assuming static user ID
        res.json(expenses);
    }
    catch (error) {
        console.error('Failed to retrieve expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses from the database' });
    }
}));
// Fetch expense summary
app.get('/api/expenses/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query and explicitly declare the type of the result.
        const [rows] = yield database_1.default.query(`
    SELECT DISTINCT
    expense_type,
    FIRST_VALUE(amount) OVER (PARTITION BY expense_type ORDER BY date DESC, id DESC) AS recent_amount,
    AVG(amount) OVER (PARTITION BY expense_type) AS average_amount
FROM expenses
WHERE user_id = 101010 AND date > DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY expense_type, date, id;
    `, [101010]); // Cast the result to the expected type
        // Map over the result to format the average_amount.
        const summary = rows.map((item) => ({
            expense_type: item.expense_type,
            average_amount: parseFloat(item.average_amount).toFixed(6),
            recent_amount: item.recent_amount
        }));
        res.json(summary);
    }
    catch (error) {
        console.error('Failed to fetch expense summary:', error);
        res.status(500).json({ message: 'Error fetching expense summary' });
    }
}));
// Add new expense(s)
app.post('/api/expenses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = req.body; // Expecting an array of expenses
    const userId = 101010; // Assuming static user ID for simplicity
    const today = new Date().toISOString().slice(0, 10);
    try {
        for (const expense of expenses) {
            const { expense_type, amount } = expense;
            // First, check if an expense of the same type already exists for today
            const [existing] = yield database_1.default.query('SELECT * FROM expenses WHERE user_id = ? AND expense_type = ? AND date = ?', [userId, expense_type, today]);
            if (existing.length > 0) {
                yield database_1.default.query('UPDATE expenses SET amount = ? WHERE user_id = ? AND expense_type = ? AND date = ?', [amount, userId, expense_type, today]);
            }
            else {
                yield database_1.default.query('INSERT INTO expenses (user_id, date, expense_type, amount) VALUES (?, ?, ?, ?)', [userId, today, expense_type, amount]);
            }
        }
        res.status(201).json({ message: 'Expenses processed successfully' });
    }
    catch (error) {
        console.error('Failed to process expenses:', error);
        res.status(500).json({ message: 'Error processing expenses' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
