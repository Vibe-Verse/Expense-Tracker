import React from 'react';
import ExpenceItem from './ExpenceItem';
import './Expenses.css';
import Card from './Card';

const Expenses = (props) => {
  return (
    <Card className='expenses'>
      {
        props.items.map((expense) => (
          <ExpenceItem
            key={expense.id}
            id={expense.id}
            date={expense.date}
            title={expense.title}
            amount={expense.amount}
            onDelete={props.onDelete}
          />
        ))
      }
    </Card>
  );
};

export default Expenses;
