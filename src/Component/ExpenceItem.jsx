import React from 'react';
import './ExpenceItem.css';
import ExpenceDate from './ExpenceDate';
import Card from './Card';

const ExpenceItem = (props) => {
  const deleteHandler = () => {
    props.onDelete(props.id);
  };

  return (
    <Card className="expense-item">
      <ExpenceDate date={new Date(props.date)} />
      
      <div className="expense-item__description">
        <h2>{props.title}</h2>
      </div>

      <div className="expense-item__actions">
        <div className="expense-item__price">${props.amount}</div>
        <button className="delete-btn" onClick={deleteHandler}>Delete</button>
      </div>
    </Card>
  );
};

export default ExpenceItem;
