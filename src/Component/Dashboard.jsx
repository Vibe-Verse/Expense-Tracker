import React, { useMemo } from "react";
import MonthlyChart from "./MonthlyChart";
import CategoryChart from "./CategoryChart";
import Insights from "./Insights";
import { formatCurrency, formatDate, isSameMonth } from "../utils/format";
import "./Dashboard.css";

const Dashboard = ({ expenses, onGoToExpenses }) => {
  const summary = useMemo(() => {
    let income = 0;
    let spent = 0;
    let monthly = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      if (expense.type === "income") {
        income += amount;
      } else {
        spent += amount;
        if (isSameMonth(expense.date)) monthly += amount;
      }
    });

    return { income, spent, monthly, balance: income - spent, count: expenses.length };
  }, [expenses]);

  const topExpenses = useMemo(
    () =>
      [...expenses]
        .filter((expense) => expense.type !== "income")
        .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
        .slice(0, 5),
    [expenses]
  );

  return (
    <div className="dashboard-view">
      <section className="summary">
        <div className="summary__card summary__card--income">
          <span className="summary__label">Income</span>
          <span className="summary__value">{formatCurrency(summary.income)}</span>
        </div>
        <div className="summary__card summary__card--expense">
          <span className="summary__label">Expenses</span>
          <span className="summary__value">{formatCurrency(summary.spent)}</span>
        </div>
        <div className="summary__card summary__card--balance">
          <span className="summary__label">Balance</span>
          <span className="summary__value">{formatCurrency(summary.balance)}</span>
        </div>
        <div className="summary__card">
          <span className="summary__label">This Month</span>
          <span className="summary__value">{formatCurrency(summary.monthly)}</span>
        </div>
      </section>

      <Insights expenses={expenses} />

      <div className="dashboard-grid">
        <CategoryChart expenses={expenses} />
        <MonthlyChart expenses={expenses} />
      </div>

      <section className="panel top-expenses">
        <div className="panel__header">
          <h2>Top expenses</h2>
          <button type="button" className="link-btn" onClick={onGoToExpenses}>
            View all →
          </button>
        </div>

        {topExpenses.length === 0 ? (
          <p className="top-expenses__empty">Nothing logged yet.</p>
        ) : (
          <ul className="top-expenses__list">
            {topExpenses.map((expense) => (
              <li key={expense.id}>
                <span className="top-expenses__title">{expense.title}</span>
                <span className="top-expenses__date">{formatDate(expense.date)}</span>
                <span className="top-expenses__amount">
                  {formatCurrency(Number(expense.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
