// src/app.ts
import express from 'express';
import cors from 'cors';
import expensesRoutes from './routes/expenses';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expensesRoutes);

export default app;