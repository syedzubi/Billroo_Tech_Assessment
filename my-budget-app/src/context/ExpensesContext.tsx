import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Expense {
  expense_type: "coffee" | "food" | "alcohol";
  amount: number;
}

interface ExpensesContextType {
  expenses: Expense[];
  fetchTodaysExpenses: () => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
};

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchTodaysExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/expenses/check-today"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch today's expenses");
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching today's expenses:", error);
    }
  };

  useEffect(() => {
    fetchTodaysExpenses();
  }, []);

  return (
    <ExpensesContext.Provider value={{ expenses, fetchTodaysExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};
