import React from 'react'
import './NewExpense.css'
import ExpenseForm from './ExpenseForm'


const NewExpense = ({ onaddData, onUpdate, editingExpense, onCancelEdit }) => {
  const isEditing = Boolean(editingExpense);

  const saveExpense = (enteredData) => {
    if (isEditing) {
      onUpdate({ ...enteredData, id: editingExpense.id });
      return;
    }
    const expenseData = {
      ...enteredData,
      id: Math.random().toString(),
    };
    onaddData(expenseData);
  };

  return (
    <div className={`new-expense${isEditing ? ' new-expense--editing' : ''}`}>
        <div className='new-expense__header'>
          <h2>{isEditing ? 'Edit expense' : 'Add a new expense'}</h2>
          <p>
            {isEditing
              ? 'Update the details and save your changes'
              : 'Fill in the details below to log your spending'}
          </p>
        </div>
        <ExpenseForm
          onSave={saveExpense}
          editingExpense={editingExpense}
          onCancelEdit={onCancelEdit}
        />
    </div>
  )
}

export default NewExpense
