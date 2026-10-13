import React, { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Component/Sidebar";
import Dashboard from "./Component/Dashboard";
import Expenses from "./Component/Expenses";
import NewExpense from "./Component/NewExpenses/NewExpense";
import BudgetPanel from "./Component/BudgetPanel";
import DataPanel from "./Component/DataPanel";
import Recurring from "./Component/Recurring";
import ConfirmDialog from "./Component/ConfirmDialog";
import useLocalStorage from "./hooks/useLocalStorage";
import { useToast } from "./context/ToastContext";
import { downloadCsv, csvToExpenses } from "./utils/csv";
import { runRecurring } from "./utils/recurring";
import "./App.css";

const API_URL = "http://localhost:3000/expenses";

export const NAV_ITEMS = [
  { id: "dashboard", path: "/", label: "Dashboard", icon: "📊" },
  { id: "expenses", path: "/expenses", label: "Transactions", icon: "🧾" },
  { id: "add", path: "/add", label: "Add New", icon: "➕" },
  { id: "recurring", path: "/recurring", label: "Recurring", icon: "🔁" },
  { id: "budget", path: "/budget", label: "Budget", icon: "🎯" },
  { id: "data", path: "/data", label: "Data", icon: "🗄️" },
];

const VIEW_META = {
  "/": { title: "Dashboard", subtitle: "Overview of your money" },
  "/expenses": { title: "Transactions", subtitle: "Search, filter and manage entries" },
  "/add": { title: "Add New", subtitle: "Log an expense or income" },
  "/recurring": { title: "Recurring", subtitle: "Automate subscriptions and income" },
  "/budget": { title: "Budget", subtitle: "Track your monthly limit" },
  "/data": { title: "Data", subtitle: "Import and export your records" },
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [theme, setTheme] = useLocalStorage("expense-tracker:theme", "dark");
  const [recurring, setRecurring] = useLocalStorage("expense-tracker:recurring", []);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const generationDone = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const fetchData = () =>
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Failed to fetch expenses", error));

  useEffect(() => {
    fetchData();
  }, []);

  const postExpense = (expense) =>
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });

  useEffect(() => {
    if (generationDone.current) return;
    generationDone.current = true;

    const { occurrences, updated } = runRecurring(recurring);
    if (occurrences.length === 0) return;

    setRecurring(updated);
    Promise.all(occurrences.map(postExpense)).then(() => {
      fetchData();
      toast.push(
        `${occurrences.length} recurring ${occurrences.length === 1 ? "entry" : "entries"} added`,
        { type: "info" }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExpenseData = (newExpenseData) => {
    postExpense(newExpenseData).then(() => {
      fetchData();
      toast.push(
        `${newExpenseData.type === "income" ? "Income" : "Expense"} added`,
        { type: "success" }
      );
      navigate("/expenses");
    });
  };

  const updateExpenseData = (updatedExpense) => {
    fetch(`${API_URL}/${updatedExpense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    }).then(() => {
      setEditingExpense(null);
      fetchData();
      toast.push("Updated successfully", { type: "success" });
      navigate("/expenses");
    });
  };

  const performDelete = (expense) => {
    setExpenses((current) => current.filter((item) => item.id !== expense.id));

    fetch(`${API_URL}/${expense.id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed");
        fetchData();
        toast.push(`Deleted "${expense.title}"`, {
          type: "info",
          actionLabel: "Undo",
          duration: 6000,
          onAction: () =>
            postExpense(expense).then(() => {
              fetchData();
              toast.push("Restored", { type: "success" });
            }),
        });
      })
      .catch(() => {
        fetchData();
        toast.push("Could not delete that entry", { type: "error" });
      });
  };

  const requestDelete = (expense) => {
    setPendingDelete(expense);
  };

  const confirmDelete = () => {
    if (pendingDelete) performDelete(pendingDelete);
    setPendingDelete(null);
  };

  const startEdit = (expense) => {
    setEditingExpense(expense);
    navigate("/add");
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    navigate("/expenses");
  };

  const handleExport = () => {
    if (expenses.length === 0) {
      toast.push("Nothing to export yet", { type: "info" });
      return;
    }
    downloadCsv(expenses, "expenses.csv");
    toast.push("Exported to CSV", { type: "success" });
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imported = csvToExpenses(String(reader.result));
      Promise.all(imported.map(postExpense)).then(() => {
        fetchData();
        toast.push(`Imported ${imported.length} ${imported.length === 1 ? "entry" : "entries"}`, {
          type: "success",
        });
        navigate("/expenses");
      });
    };
    reader.readAsText(file);
  };

  const generateRecurring = () => {
    const { occurrences, updated } = runRecurring(recurring);
    if (occurrences.length === 0) {
      toast.push("No recurring entries are due", { type: "info" });
      return;
    }
    setRecurring(updated);
    Promise.all(occurrences.map(postExpense)).then(() => {
      fetchData();
      toast.push(`Added ${occurrences.length} recurring ${occurrences.length === 1 ? "entry" : "entries"}`, {
        type: "success",
      });
    });
  };

  const totalCount = useMemo(() => expenses.length, [expenses]);
  const meta = VIEW_META[location.pathname] || VIEW_META["/"];

  return (
    <div className="layout">
      <Sidebar
        items={NAV_ITEMS}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        total={totalCount}
      />

      <main className="main">
        <div className="content">
          <header className="page-header">
            <h2>{location.pathname === "/add" && editingExpense ? "Edit Entry" : meta.title}</h2>
            <p>
              {location.pathname === "/add" && editingExpense
                ? "Update the details of this entry"
                : meta.subtitle}
            </p>
          </header>

          <div className="view">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    expenses={expenses}
                    onGoToExpenses={() => navigate("/expenses")}
                  />
                }
              />
              <Route
                path="/expenses"
                element={
                  <Expenses
                    items={expenses}
                    onDelete={(id) => {
                      const expense = expenses.find((item) => item.id === id);
                      if (expense) requestDelete(expense);
                    }}
                    onEdit={startEdit}
                  />
                }
              />
              <Route
                path="/add"
                element={
                  <NewExpense
                    onaddData={addExpenseData}
                    onUpdate={updateExpenseData}
                    editingExpense={editingExpense}
                    onCancelEdit={cancelEdit}
                  />
                }
              />
              <Route
                path="/recurring"
                element={
                  <Recurring
                    rules={recurring}
                    onChange={setRecurring}
                    onGenerateNow={generateRecurring}
                  />
                }
              />
              <Route
                path="/budget"
                element={
                  <div className="narrow-view">
                    <BudgetPanel expenses={expenses} />
                  </div>
                }
              />
              <Route
                path="/data"
                element={
                  <DataPanel
                    count={expenses.length}
                    onExport={handleExport}
                    onImport={handleImport}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this entry?"
        message={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed. You can undo right after.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default App;
