import React, { useMemo } from "react";
import { formatCurrency, monthLabel, shiftMonth } from "../utils/format";
import "./Insights.css";

const Insights = ({ expenses }) => {
  const data = useMemo(() => {
    const current = new Date();
    const prev = shiftMonth(1);

    const inMonth = (value, ref) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return false;
      return (
        date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth()
      );
    };

    let expNow = 0;
    let expPrev = 0;
    let incNow = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      const isIncome = expense.type === "income";
      if (inMonth(expense.date, current)) {
        if (isIncome) incNow += amount;
        else expNow += amount;
      }
      if (!isIncome && inMonth(expense.date, prev)) {
        expPrev += amount;
      }
    });

    const delta =
      expPrev > 0 ? ((expNow - expPrev) / expPrev) * 100 : null;
    const net = incNow - expNow;
    const savingsRate = incNow > 0 ? (net / incNow) * 100 : null;

    return { expNow, expPrev, delta, net, incNow, savingsRate, prevLabel: monthLabel(prev) };
  }, [expenses]);

  const trendClass =
    data.delta === null ? "flat" : data.delta > 0 ? "up" : data.delta < 0 ? "down" : "flat";
  const trendArrow = data.delta === null ? "•" : data.delta > 0 ? "▲" : data.delta < 0 ? "▼" : "•";

  return (
    <section className="panel insights">
      <div className="panel__header">
        <h2>Insights</h2>
        <span className="panel__hint">vs {data.prevLabel}</span>
      </div>

      <div className="insights__grid">
        <div className="insight">
          <span className="insight__label">Spending change</span>
          <span className={`insight__value insight__value--${trendClass}`}>
            {data.delta === null
              ? "—"
              : `${trendArrow} ${Math.abs(Math.round(data.delta))}%`}
          </span>
          <span className="insight__hint">
            {formatCurrency(data.expNow)} this month
          </span>
        </div>

        <div className="insight">
          <span className="insight__label">Net this month</span>
          <span
            className={`insight__value ${data.net >= 0 ? "insight__value--down" : "insight__value--up"}`}
          >
            {data.net >= 0 ? "+" : "−"}
            {formatCurrency(Math.abs(data.net))}
          </span>
          <span className="insight__hint">income − expenses</span>
        </div>

        <div className="insight">
          <span className="insight__label">Savings rate</span>
          <span className="insight__value">
            {data.savingsRate === null ? "—" : `${Math.round(data.savingsRate)}%`}
          </span>
          <span className="insight__hint">
            {data.savingsRate === null ? "No income logged" : "of income kept"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Insights;
