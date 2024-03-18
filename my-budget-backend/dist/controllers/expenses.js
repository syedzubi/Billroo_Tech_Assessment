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
exports.addExpense = exports.getExpenseSummary = exports.getAllExpenses = exports.getExpensesForToday = void 0;
const db_1 = __importDefault(require("../db"));
const expensesQueries_1 = require("../db/queries/expensesQueries");
const getExpensesForToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = 101010;
        const today = new Date().toISOString().slice(0, 10);
        const [expensesForTypeToday] = yield db_1.default.query(expensesQueries_1.queries.getExpensesForToday, [userId, today]);
        if (expensesForTypeToday.length > 0) {
            res.json(expensesForTypeToday);
        }
        else {
            res.status(404).json({ message: 'No expenses found for today.' });
        }
    }
    catch (error) {
        console.error('Failed to check expenses:', error);
        res.status(500).json({ message: 'Error checking expenses' });
    }
});
exports.getExpensesForToday = getExpensesForToday;
const getAllExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = 101010; // Static user ID
        const [expenses] = yield db_1.default.query(expensesQueries_1.queries.getAllExpenses, [userId]);
        res.json(expenses);
    }
    catch (error) {
        console.error('Failed to retrieve expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});
exports.getAllExpenses = getAllExpenses;
const getExpenseSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = 101010; // Static user ID for simplicity
        const [rows] = yield db_1.default.query(expensesQueries_1.queries.getExpenseSummary, [userId]);
        const summary = rows.map((item) => ({
            expense_type: item.expense_type,
            average_amount: parseFloat(item.average_amount).toFixed(2), // Adjusted for simplicity
            recent_amount: item.recent_amount
        }));
        res.json(summary);
    }
    catch (error) {
        console.error('Failed to fetch expense summary:', error);
        res.status(500).json({ message: 'Error fetching expense summary' });
    }
});
exports.getExpenseSummary = getExpenseSummary;
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = req.body; // Expecting an array of expenses
    const userId = 101010; // Assuming static user ID for simplicity
    const today = new Date().toISOString().slice(0, 10);
    try {
        yield Promise.all(expenses.map((expense) => __awaiter(void 0, void 0, void 0, function* () {
            const { expense_type, amount } = expense;
            const [existing] = yield db_1.default.query(expensesQueries_1.queries.checkExistingExpense, [userId, expense_type, today]);
            if (existing.length > 0) {
                yield db_1.default.query(expensesQueries_1.queries.updateExpense, [amount, userId, expense_type, today]);
            }
            else {
                yield db_1.default.query(expensesQueries_1.queries.addExpense, [userId, today, expense_type, amount]);
            }
        })));
        res.status(201).json({ message: 'Expenses processed successfully' });
    }
    catch (error) {
        console.error('Failed to process expenses:', error);
        res.status(500).json({ message: 'Error processing expenses' });
    }
});
exports.addExpense = addExpense;
