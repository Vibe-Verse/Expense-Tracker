import React, { useMemo, useState } from "react";
import ExpenceItem from "./ExpenceItem";
import { getCategoryMeta } from "../constants";
import "./Expenses.css";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
];

const Expenses = (props) => {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const monthOptions = useMemo(() => {
    const map = new Map();
    props.items.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, date.toLocaleString("en-US", { month: "long", year: "numeric" }));
      }
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [props.items]);

  const categoryOptions = useMemo(() => {
    const set = new Set(props.items.map((item) => item.category).filter(Boolean));
    return Array.from(set);
  }, [props.items]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = props.items.filter((expense) => {
      const matchesSearch = !query || expense.title?.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      const expenseType = expense.type === "income" ? "income" : "expense";
      if (typeFilter !== "all" && expenseType !== typeFilter) return false;

      if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;

      if (month === "all") return true;
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return false;
      return `${date.getFullYear()}-${date.getMonth()}` === month;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "amount-desc") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === "amount-asc") return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      return sortBy === "date-asc" ? da - db : db - da;
    });

    return sorted;
  }, [props.items, search, month, sortBy, typeFilter, categoryFilter]);

  const isFiltering =
    search.trim() !== "" ||
    month !== "all" ||
    typeFilter !== "all" ||
    categoryFilter !== "all";

  return (
    <div className="expenses">
      <div className="expenses__header">
        <h2>All transactions</h2>
        <span className="expenses__count">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="expenses__controls">
        <div className="control control--search">
          <span className="control__icon">🔍</span>
          <input
            type="search"
            value={search}
            placeholder="Search by title..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="segmented">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`segmented__btn${
                typeFilter === option.value ? " segmented__btn--active" : ""
              }`}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          className="control"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {getCategoryMeta(category).label}
            </option>
          ))}
        </select>

        <select
          className="control"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          aria-label="Filter by month"
        >
          <option value="all">All months</option>
          {monthOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="control"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort expenses"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="expenses__empty">
          <span className="expenses__empty-icon">{isFiltering ? "🔎" : "🗂️"}</span>
          <p>{isFiltering ? "No matching transactions" : "Nothing here yet"}</p>
          <span>
            {isFiltering
              ? "Try a different search or clear the filters."
              : "Add your first entry using the Add Expense page."}
          </span>
        </div>
      ) : (
        visible.map((expense) => (
          <ExpenceItem
            key={expense.id}
            id={expense.id}
            date={expense.date}
            title={expense.title}
            amount={expense.amount}
            category={expense.category}
            type={expense.type}
            onDelete={props.onDelete}
            onEdit={props.onEdit}
          />
        ))
      )}
    </div>
  );
};

export default Expenses;
