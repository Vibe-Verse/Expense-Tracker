import React from 'react';
import './ExpenceDate.css';

const ExpenceDate = (props) => {
  if (!props.date || isNaN(new Date(props.date))) {
    return <div className='expense-date'>Invalid date</div>;
  }

  const dateObj = new Date(props.date);
  const month = dateObj.toLocaleString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  const day = dateObj.toLocaleString('en-US', { day: '2-digit' });

  return (
    <div className='expense-date'>
      <div className='expense-date__day'>{day}</div>
      <div className='expense-date__month'>{month}</div>
      <div className='expense-date__year'>{year}</div>
    </div>
  );
};

export default ExpenceDate;
