import React, { useEffect, useState } from "react";
import { getCategories, TYPES } from "../../constants";
import { toDateInput } from "../../utils/format";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");

  const isEditing = Boolean(props.editingExpense);
  const categories = getCategories(type);

  useEffect(() => {
    if (props.editingExpense) {
      const editing = props.editingExpense;
      const editingType = editing.type === "income" ? "income" : "expense";
      setType(editingType);
      setTitle(editing.title ?? "");
      setAmount(editing.amount ?? "");
      setDate(toDateInput(editing.date));
      setCategory(editing.category || getCategories(editingType)[0].id);
    } else {
      setType("expense");
      setTitle("");
      setAmount("");
      setDate("");
      setCategory("Food");
    }
  }, [props.editingExpense]);

  const changeType = (nextType) => {
    setType(nextType);
    setCategory(getCategories(nextType)[0].id);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const data = {
      title: title.trim(),
      amount: amount,
      date: new Date(date),
      type,
      category,
    };

    props.onSave(data);

    if (!isEditing) {
      setTitle("");
      setAmount("");
      setDate("");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="type-toggle" role="group" aria-label="Transaction type">
        {TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`type-toggle__btn type-toggle__btn--${item.id}${
              type === item.id ? " type-toggle__btn--active" : ""
            }`}
            onClick={() => changeType(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="new-expense__controls">
        <div>
          <label htmlFor="expense-title">Title</label>
          <input
            id="expense-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label htmlFor="expense-amount">Amount</label>
          <input
            id="expense-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="new-expense__actions">
        {isEditing && (
          <button type="button" className="alternative" onClick={props.onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="submit">
          {isEditing
            ? "Update"
            : type === "income"
            ? "Add Income"
            : "Add Expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
