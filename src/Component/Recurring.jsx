import React, { useState } from "react";
import CategoryChip from "./CategoryChip";
import { getCategories, TYPES } from "../constants";
import { createRecurringRule, describeSchedule } from "../utils/recurring";
import { formatCurrency } from "../utils/format";
import "./Recurring.css";

const emptyForm = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  day: "1",
};

const Recurring = ({ rules, onChange, onGenerateNow }) => {
  const [form, setForm] = useState(emptyForm);

  const categories = getCategories(form.type);

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const changeType = (type) => {
    update({ type, category: getCategories(type)[0].id });
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onChange([...rules, createRecurringRule(form)]);
    setForm({ ...emptyForm, type: form.type, category: getCategories(form.type)[0].id });
  };

  const remove = (id) => onChange(rules.filter((rule) => rule.id !== id));

  const toggle = (id) =>
    onChange(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );

  return (
    <div className="recurring-view">
      <section className="panel">
        <div className="panel__header">
          <h2>Add a recurring entry</h2>
          <button type="button" className="link-btn" onClick={onGenerateNow}>
            Run due now
          </button>
        </div>

        <form className="recurring-form" onSubmit={submit}>
          <div className="type-toggle" role="group" aria-label="Recurring type">
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`type-toggle__btn type-toggle__btn--${item.id}${
                  form.type === item.id ? " type-toggle__btn--active" : ""
                }`}
                onClick={() => changeType(item.id)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="recurring-form__grid">
            <label>
              <span>Title</span>
              <input
                type="text"
                value={form.title}
                placeholder="e.g. Netflix"
                onChange={(event) => update({ title: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                placeholder="0.00"
                onChange={(event) => update({ amount: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Category</span>
              <select
                className="form-select"
                value={form.category}
                onChange={(event) => update({ category: event.target.value })}
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.icon} {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Day of month</span>
              <input
                type="number"
                min="1"
                max="28"
                value={form.day}
                onChange={(event) => update({ day: event.target.value })}
                required
              />
            </label>
          </div>

          <div className="recurring-form__actions">
            <button type="submit">Add recurring</button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>Your recurring entries</h2>
          <span className="panel__hint">{rules.length} configured</span>
        </div>

        {rules.length === 0 ? (
          <p className="recurring-empty">
            No recurring entries yet. Add subscriptions or regular income above.
          </p>
        ) : (
          <ul className="recurring-list">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className={`recurring-item${rule.enabled ? "" : " recurring-item--off"}`}
              >
                <div className="recurring-item__main">
                  <span className="recurring-item__title">{rule.title}</span>
                  <div className="recurring-item__meta">
                    <CategoryChip category={rule.category} size="sm" />
                    <span className="recurring-item__schedule">
                      {describeSchedule(rule.day)}
                    </span>
                  </div>
                </div>

                <span
                  className={`recurring-item__amount${
                    rule.type === "income" ? " recurring-item__amount--income" : ""
                  }`}
                >
                  {rule.type === "income" ? "+" : "−"}
                  {formatCurrency(rule.amount)}
                </span>

                <button
                  type="button"
                  className={`switch${rule.enabled ? " switch--on" : ""}`}
                  onClick={() => toggle(rule.id)}
                  aria-label={rule.enabled ? "Disable" : "Enable"}
                >
                  <span className="switch__knob" />
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => remove(rule.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Recurring;
