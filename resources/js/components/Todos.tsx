import React from 'react'
import { connect } from 'react-redux'
import { TodosState } from '../store/todos/types'
import { addTodo, removeTodo, saveAndToggleTodo } from '../store/todos/actions'

interface TodosProps {
  todos: TodosState;
  dispatchAddTodo: typeof addTodo;
  dispatchRemoveTodo: typeof removeTodo;
  dispatchSaveAndToggleTodo: typeof saveAndToggleTodo;
}

const Todos = ({ todos, dispatchSaveAndToggleTodo }: TodosProps) => (
  <div>
    <h2>this is the Todos List</h2>
    <ul>
      {todos.map(todo => (
        <li key={todo.task}>
          <p>
            {todo.task}: {todo.completed ? 'done' : 'not done'}
          </p>
          <button type="button" onClick={() => dispatchSaveAndToggleTodo(todo)}>Toggle</button>
        </li>
      ))}
    </ul>
  </div>
)

const mapStateToProps = ({ todos }: { todos: TodosState }) => ({
  todos,
})

export default connect(
  mapStateToProps,
  {
    dispatchAddTodo: addTodo,
    dispatchRemoveTodo: removeTodo,
    dispatchSaveAndToggleTodo: saveAndToggleTodo,
  },
)(Todos)
