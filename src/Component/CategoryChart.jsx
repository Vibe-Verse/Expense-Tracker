import React, { useMemo } from "react";
import { getCategoryMeta } from "../constants";
import { formatCurrency, isSameMonth } from "../utils/format";
import "./CategoryChart.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CategoryChart = ({ expenses }) => {
  const { slices, total } = useMemo(() => {
    const totals = new Map();

    expenses.forEach((expense) => {
      if (expense.type === "income") return;
      if (!isSameMonth(expense.date)) return;
      const category = expense.category || "Other";
      totals.set(category, (totals.get(category) || 0) + (Number(expense.amount) || 0));
    });

    const entries = Array.from(totals.entries())
      .map(([id, value]) => ({ ...getCategoryMeta(id), value }))
      .sort((a, b) => b.value - a.value);

    const sum = entries.reduce((acc, item) => acc + item.value, 0);
    return { slices: entries, total: sum };
  }, [expenses]);

  let offset = 0;

  return (
    <section className="panel category-chart">
      <div className="panel__header">
        <h2>Spending by category</h2>
        <span className="panel__hint">This month</span>
      </div>

      {slices.length === 0 ? (
        <p className="category-chart__empty">No expenses recorded this month.</p>
      ) : (
        <div className="category-chart__body">
          <div className="donut">
            <svg viewBox="0 0 140 140" role="img" aria-label="Spending by category">
              <circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke="var(--track)"
                strokeWidth="20"
              />
              {slices.map((slice) => {
                const fraction = slice.value / total;
                const length = fraction * CIRCUMFERENCE;
                const dash = `${length} ${CIRCUMFERENCE - length}`;
                const element = (
                  <circle
                    key={slice.id}
                    cx="70"
                    cy="70"
                    r={RADIUS}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="20"
                    strokeDasharray={dash}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 70 70)"
                    strokeLinecap="butt"
                  />
                );
                offset += length;
                return element;
              })}
            </svg>
            <div className="donut__center">
              <span className="donut__total">{formatCurrency(total)}</span>
              <span className="donut__caption">spent</span>
            </div>
          </div>

          <ul className="category-legend">
            {slices.map((slice) => (
              <li key={slice.id}>
                <span
                  className="category-legend__dot"
                  style={{ background: slice.color }}
                />
                <span className="category-legend__label">
                  {slice.icon} {slice.label}
                </span>
                <span className="category-legend__value">{formatCurrency(slice.value)}</span>
                <span className="category-legend__pct">
                  {Math.round((slice.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default CategoryChart;
