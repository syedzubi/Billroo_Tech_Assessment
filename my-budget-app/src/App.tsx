import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddEditExpensesPage from "./pages/AddEditExpensesPage";
import { ExpensesProvider } from "./context/ExpensesContext";

const App = () => {
  return (
    <ExpensesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/edit-expenses" element={<AddEditExpensesPage />} />
        </Routes>
      </Router>
    </ExpensesProvider>
  );
};

export default App;
