import React, { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const titleChange = (event) => {
    // console.log(event.target.value);
    setTitle(event.target.value);
  };
  const amountChange = (event) => {
    // console.log(event.target.value);
    setAmount(event.target.value);
  };
  const dateChange = (event) => {
    // console.log(event.target.value);
    setDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const data = {
      title: title,
      amount: amount,
      date: new Date(date),
    };

    props.onSave(data);

    setTitle("");
    setAmount("");
    setDate("");
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div>
          <label htmlFor="">Title</label>
          <input type="text" value={title} onChange={titleChange} placeholder="Enter Title"/>
        </div>
        <div>
          <label htmlFor="">Amount</label>
          <input type="number" value={amount} onChange={amountChange} placeholder="Enter Amount" />
        </div>
        <div>
          <label htmlFor="">Date</label>
          <input type="date" value={date} onChange={dateChange} />
        </div>
      </div>
      <div className="new-expense__actions">
        <button type="submit">Add Exepnse</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
