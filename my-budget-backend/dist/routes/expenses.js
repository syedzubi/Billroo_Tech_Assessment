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
const database_1 = __importDefault(require("../database")); // Adjust the path as necessary
const router = express_1.default.Router();
// Fetch all expenses
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [expenses] = yield database_1.default.query('SELECT * FROM expenses');
        res.json(expenses);
    }
    catch (error) {
        console.error('Failed to fetch expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
}));
exports.default = router;
