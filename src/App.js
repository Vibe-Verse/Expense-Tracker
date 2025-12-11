import React, { useEffect, useState } from "react";
import Expenses from "./Component/Expenses";
import NewExpense from "./Component/NewExpenses/NewExpense";

let copy_expenses = [];

function App() {
  const [expenses, setExpenses] = useState(copy_expenses);

  const fetchData = () => {
    fetch('http://localhost:3000/expenses')
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((error) => {
        console.error('Failed to fetch expenses', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addExpenseData = (newExpenseData) => {
    fetch('http://localhost:3000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // ✅ FIXED TYPO HERE
      },
      body: JSON.stringify(newExpenseData),
    }).then(() => fetchData());
  };

  const deleteExpenseHandler = (id) => {
    fetch(`http://localhost:3000/expenses/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) fetchData();
        else console.error("Failed to delete expense");
      })
      .catch((error) => console.error('Delete failed', error));
  };

  return (
    <div>
      <NewExpense onaddData={addExpenseData} />
      <Expenses items={expenses} onDelete={deleteExpenseHandler} />
    </div>
  );
}

export default App;
