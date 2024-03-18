import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaBeer, FaCoffee, FaUtensils } from "react-icons/fa";

interface Expense {
  expense_type: "coffee" | "food" | "alcohol";
  amount: number;
}

const AddEditExpensesPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([
    { expense_type: "coffee", amount: 1 },
    { expense_type: "food", amount: 1 },
    { expense_type: "alcohol", amount: 1 },
  ]);

  const fetchTodaysExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/expenses/check-today"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch today's expenses");
      }
      const data = await response.json();

      const filteredExpenses = data.filter((expense: Expense) =>
        ["coffee", "food", "alcohol"].includes(expense.expense_type)
      );

      if (filteredExpenses.length === 0) {
        setExpenses([
          { expense_type: "coffee", amount: 1 },
          { expense_type: "food", amount: 1 },
          { expense_type: "alcohol", amount: 1 },
        ]);
      } else {
        setExpenses(filteredExpenses);
      }
    } catch (error) {
      console.error("Error fetching today's expenses:", error);
    }
  };

  // Fetch today's expenses when the component mounts
  useEffect(() => {
    fetchTodaysExpenses();
  }, []);

  // Update expense state
  const handleExpenseChange = (type: string, newAmount: number) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.expense_type === type
          ? { ...expense, amount: newAmount }
          : expense
      )
    );
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/");
  };

  // Handle form submission
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenses),
      });

      if (!response.ok) {
        throw new Error("Failed to save expenses");
      }

      // On successful save, redirect back
      navigate("/");
    } catch (error) {
      console.error("Error saving expenses:", error);
      // Display an error message to the user (not implemented here)
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", mt: 5, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          How much did I spend today?
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} alignItems="flex-end">
            {expenses.map((expense) => (
              <Grid item xs={12} key={expense.expense_type}>
                {expense.expense_type === "coffee" && <FaCoffee />}
                {expense.expense_type === "food" && <FaUtensils />}
                {expense.expense_type === "alcohol" && <FaBeer />}
                <TextField
                  label={
                    expense.expense_type.charAt(0).toUpperCase() +
                    expense.expense_type.slice(1)
                  }
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 100 } }}
                  fullWidth
                  margin="normal"
                  value={expense.amount}
                  onChange={(e) =>
                    handleExpenseChange(
                      expense.expense_type,
                      Number(e.target.value)
                    )
                  }
                />
              </Grid>
            ))}
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBackClick}
                fullWidth
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Add expenses
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEditExpensesPage;
