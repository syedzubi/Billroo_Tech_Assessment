import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FaBeer, FaCoffee, FaUtensils, FaQuestionCircle } from "react-icons/fa";

interface ExpenseSummaryData {
  expense_type: string;
  average_amount: string;
  recent_amount: string;
}

const defaultExpenses: ExpenseSummaryData[] = [
  { expense_type: "coffee", average_amount: "0", recent_amount: "0" },
  { expense_type: "food", average_amount: "0", recent_amount: "0" },
  { expense_type: "alcohol", average_amount: "0", recent_amount: "0" },
];

const iconMap = {
  coffee: <FaCoffee style={{ color: "brown" }} />,
  food: <FaUtensils style={{ color: "green" }} />,
  alcohol: <FaBeer style={{ color: "goldenRod" }} />,
  default: <FaQuestionCircle />,
};

const ExpenseSummary = () => {
  const [expenses, setExpenses] =
    useState<ExpenseSummaryData[]>(defaultExpenses);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/expenses/summary"
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data: ExpenseSummaryData[] = await response.json(); // Type the expected data
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expense summary:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Card sx={{ maxWidth: 300, margin: "auto", mt: 5 }}>
      <CardContent>
        <Grid container spacing={2}>
          {expenses.map((expense) => (
            <Grid item container key={expense.expense_type} alignItems="center">
              <Grid item xs={6} container alignItems="center">
                {iconMap[expense.expense_type as keyof typeof iconMap] ||
                  iconMap["default"]}
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {expense.expense_type.charAt(0).toUpperCase() +
                    expense.expense_type.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={6} container alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ${parseFloat(expense.average_amount).toFixed(2)} / week
                </Typography>
                {parseFloat(expense.recent_amount) >
                parseFloat(expense.average_amount) ? (
                  <ArrowUpwardIcon color="error" sx={{ mx: 1 }} />
                ) : (
                  <ArrowDownwardIcon color="success" sx={{ mx: 1 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    mx: 1,
                    color:
                      parseFloat(expense.recent_amount) >
                      parseFloat(expense.average_amount)
                        ? "error.main"
                        : "success.main",
                    fontFamily: '"Comic Sans MS", cursive, sans-serif',
                  }}
                >
                  {Math.abs(
                    parseFloat(expense.recent_amount) -
                      parseFloat(expense.average_amount)
                  ).toFixed(2)}
                  %{" "}
                  {parseFloat(expense.recent_amount) >
                  parseFloat(expense.average_amount)
                    ? "above"
                    : "below"}{" "}
                  average
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
export default ExpenseSummary;
