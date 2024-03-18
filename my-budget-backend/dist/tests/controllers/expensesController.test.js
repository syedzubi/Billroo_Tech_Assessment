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
const db_1 = __importDefault(require("../../db"));
const expenses_1 = require("../../controllers/expenses");
jest.mock('../../db', () => ({
    query: jest.fn()
}));
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('Expenses Controller', () => {
    it('getAllExpenses sends correct response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = mockResponse();
        // Mocking pool.query to return a fake expenses list
        db_1.default.query.mockResolvedValueOnce([
            [{ id: 1, user_id: 101010, expense_type: 'coffee', amount: 3.50 }]
        ]);
        yield (0, expenses_1.getAllExpenses)(req, res);
        // Asserting response
        expect(res.json).toHaveBeenCalledWith([
            { id: 1, user_id: 101010, expense_type: 'coffee', amount: 3.50 },
        ]);
    }));
    it('getExpensesForToday sends correct response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = mockResponse();
        db_1.default.query.mockResolvedValueOnce([
            [{ id: 2, user_id: 101010, expense_type: 'coffee', amount: 4.00, date: new Date().toISOString().slice(0, 10) }]
        ]);
        yield (0, expenses_1.getExpensesForToday)(req, res);
        expect(res.json).toHaveBeenCalledWith([
            { id: 2, user_id: 101010, expense_type: 'coffee', amount: 4.00, date: new Date().toISOString().slice(0, 10) }
        ]);
    }));
    it('getExpenseSummary sends correct response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = mockResponse();
        db_1.default.query.mockResolvedValueOnce([
            [{ expense_type: 'coffee', recent_amount: '4.00', average_amount: '3.75' }]
        ]);
        yield (0, expenses_1.getExpenseSummary)(req, res);
        expect(res.json).toHaveBeenCalledWith([
            { expense_type: 'coffee', recent_amount: '4.00', average_amount: '3.75' }
        ]);
    }));
    it('addExpense processes successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: [{ expense_type: 'coffee', amount: 5.00 }] };
        const res = mockResponse();
        // Mock to simulate no existing expense for today, triggering an insert
        db_1.default.query
            .mockResolvedValueOnce([[]]) // Check for existing expense
            .mockResolvedValueOnce([{}]); // Insert new expense
        yield (0, expenses_1.addExpense)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expenses processed successfully' });
    }));
});
