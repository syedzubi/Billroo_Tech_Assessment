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
const promise_1 = __importDefault(require("mysql2/promise"));
require("dotenv/config"); // Make sure to import dotenv if you need to load environment variables
// Create a pool of connections to the database
const pool = promise_1.default.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "budget_app",
    password: "PeRson1ified#"
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        const [rows] = yield connection.execute('SELECT 1');
        console.log('Connected to the MySQL database:', rows);
        connection.release();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}))();
exports.default = pool;
