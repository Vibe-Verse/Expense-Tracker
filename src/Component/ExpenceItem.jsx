import React from 'react';
import './ExpenceItem.css';
import ExpenceDate from './ExpenceDate';
import CategoryChip from './CategoryChip';
import Card from './Card';
import { formatCurrency } from '../utils/format';

const ExpenceItem = (props) => {
  const isIncome = props.type === 'income';

  const deleteHandler = () => {
    props.onDelete(props.id);
  };

  const editHandler = () => {
    props.onEdit({
      id: props.id,
      title: props.title,
      amount: props.amount,
      date: props.date,
      category: props.category,
      type: props.type,
    });
  };

  return (
    <Card className={`expense-item${isIncome ? ' expense-item--income' : ''}`}>
      <ExpenceDate date={new Date(props.date)} />

      <div className="expense-item__description">
        <h2>{props.title}</h2>
        {props.category && <CategoryChip category={props.category} size="sm" />}
      </div>

      <div className="expense-item__actions">
        <div className={`expense-item__price${isIncome ? ' expense-item__price--income' : ''}`}>
          {isIncome ? '+' : '−'}
          {formatCurrency(Number(props.amount))}
        </div>
        <button className="edit-btn" onClick={editHandler}>Edit</button>
        <button className="delete-btn" onClick={deleteHandler}>Delete</button>
      </div>
    </Card>
  );
};

export default ExpenceItem;
