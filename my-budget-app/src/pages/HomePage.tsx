// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import ExpenseSummary from "../components/ExpenseSummary";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpensesContext";
import exp from "constants";

const HomePage = () => {
  const navigate = useNavigate();
  const { expenses } = useExpenses();

  const handleAddClick = () => {
    navigate("/edit-expenses");
  };

  useEffect(() => {
    console.log("expenses", expenses);
  }, []);

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
              {expenses ? "Edit expenses" : "Add expenses"}
            </Button>
          </Grid>
        </Grid>
        <ExpenseSummary />
      </Box>
    </Container>
  );
};

export default HomePage;
