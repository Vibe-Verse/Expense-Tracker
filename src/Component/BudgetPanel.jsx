import React, { useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import "./BudgetPanel.css";

const BudgetPanel = ({ expenses }) => {
  const [budget, setBudget] = useLocalStorage("expense-tracker:budget", 1000);

  const spent = useMemo(() => {
    const now = new Date();
    return expenses.reduce((sum, expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return sum;
      const sameMonth =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth();
      return sameMonth ? sum + (Number(expense.amount) || 0) : sum;
    }, 0);
  }, [expenses]);

  const numericBudget = Number(budget) || 0;
  const percent = numericBudget > 0 ? (spent / numericBudget) * 100 : 0;
  const remaining = numericBudget - spent;
  const overBudget = numericBudget > 0 && spent > numericBudget;
  const nearLimit = !overBudget && percent >= 80;

  const status = overBudget ? "over" : nearLimit ? "warning" : "ok";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="panel budget">
      <div className="panel__header">
        <h2>Monthly budget</h2>
        <span className="panel__hint">{monthLabel}</span>
      </div>

      <label className="budget__field">
        <span>Budget amount</span>
        <div className="budget__input-wrap">
          <span className="budget__prefix">$</span>
          <input
            type="number"
            min="0"
            step="10"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />
        </div>
      </label>

      <div className="budget__meter">
        <div className="budget__meter-head">
          <span>
            {formatCurrency(spent)} <em>of</em> {formatCurrency(numericBudget)}
          </span>
          <span className={`budget__percent budget__percent--${status}`}>
            {Math.round(percent)}%
          </span>
        </div>
        <div className="budget__track">
          <div
            className={`budget__fill budget__fill--${status}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      {overBudget ? (
        <div className="budget__alert budget__alert--over">
          ⚠️ You are over budget by {formatCurrency(Math.abs(remaining))}.
        </div>
      ) : nearLimit ? (
        <div className="budget__alert budget__alert--warning">
          🔔 Heads up — you have {formatCurrency(remaining)} left this month.
        </div>
      ) : (
        <div className="budget__alert budget__alert--ok">
          ✅ {formatCurrency(remaining)} remaining this month.
        </div>
      )}
    </section>
  );
};

export default BudgetPanel;
