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
import { useExpenses } from "../context/ExpensesContext";

const AddEditExpensesPage = () => {
  const navigate = useNavigate();
  const { expenses, setExpenses } = useExpenses();

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
      const response = await fetch("http://localhost:3001/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenses),
      });

      if (!response.ok) {
        throw new Error("Failed to save expenses");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving expenses:", error);
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
                {expense.expense_type === "coffee" && (
                  <FaCoffee style={{ color: "brown" }} />
                )}
                {expense.expense_type === "food" && (
                  <FaUtensils style={{ color: "green" }} />
                )}
                {expense.expense_type === "alcohol" && (
                  <FaBeer style={{ color: "goldenrod" }} />
                )}
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
                Add expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEditExpensesPage;
