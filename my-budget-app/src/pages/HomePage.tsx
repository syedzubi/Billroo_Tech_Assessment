import React from "react";
import ExpenseSummary from "../components/ExpenseSummary";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpensesContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { expenses } = useExpenses();

  const areAllExpensesZero = expenses.every((expense) => expense.amount === 0);

  const handleAddClick = () => {
    navigate("/edit-expenses");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm>
            <Typography variant="h4" component="h1">
              <i>Am I spending too much?</i>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClick}
            >
              {areAllExpensesZero ? "Add expenses" : "Edit expenses"}
            </Button>
          </Grid>
        </Grid>
        <ExpenseSummary />
      </Box>
    </Container>
  );
};

export default HomePage;
