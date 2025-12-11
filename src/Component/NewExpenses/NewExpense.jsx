import React from 'react'
import './NewExpense.css'
import ExpenseForm from './ExpenseForm'
  

const NewExpense = ({onaddData}) => {

  const addExpense = (enteredData) => {
    const expenseData = {
      ...enteredData,
      id:Math.random().toString(),
    }
    // console.log(enteredData);
    onaddData(expenseData);
    console.log(expenseData);
    
  };

  return (
    <div className='new-expense'>
        <ExpenseForm onSave={addExpense}/>
    </div>
  )
}

export default NewExpense 