import React, { useMemo } from "react";
import "./MonthlyChart.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MonthlyChart = ({ expenses }) => {
  const { data, max, peakIdx } = useMemo(() => {
    const now = new Date();
    const buckets = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: MONTHS[d.getMonth()],
        year: d.getFullYear(),
        total: 0,
      });
    }

    const index = new Map(buckets.map((b) => [b.key, b]));

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = index.get(key);
      if (bucket) bucket.total += Number(expense.amount) || 0;
    });

    const maxTotal = Math.max(...buckets.map((b) => b.total), 1);
    let peak = 0;
    buckets.forEach((b, i) => {
      if (b.total > buckets[peak].total) peak = i;
    });

    return { data: buckets, max: maxTotal, peakIdx: peak };
  }, [expenses]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Monthly spending</h2>
        <span className="panel__hint">Last 6 months</span>
      </div>

      <div className="chart">
        {data.map((bucket, i) => {
          const height = Math.max((bucket.total / max) * 100, bucket.total > 0 ? 4 : 0);
          return (
            <div className="chart__col" key={bucket.key}>
              <span className="chart__value">{formatCurrency(bucket.total)}</span>
              <div className="chart__track">
                <div
                  className={`chart__bar${i === peakIdx && bucket.total > 0 ? " chart__bar--peak" : ""}`}
                  style={{ height: `${height}%` }}
                  title={`${bucket.label} ${bucket.year}: ${formatCurrency(bucket.total)}`}
                />
              </div>
              <span className="chart__label">{bucket.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MonthlyChart;
