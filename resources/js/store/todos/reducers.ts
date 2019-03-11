import {
  TodosState,
  TodosActionTypes,
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from './types'

export const initialState: TodosState = [{
  task: 'feed the cat',
  completed: true,
}]

const todos = (
  state: TodosState = initialState,
  action: TodosActionTypes,
): TodosState => {
  switch (action.type) {
    case ADD_TODO: {
      return [
        ...state,
        {
          task: action.todo.task,
          completed: action.todo.completed,
        },
      ]
    }
    case REMOVE_TODO: {
      return state.filter(todo => todo.task !== action.todo.task)
    }
    case TOGGLE_TODO: {
      const otherTodos = state.filter(todo => todo.task !== action.todo.task)
      const newTodo = {
        task: action.todo.task,
        completed: !action.todo.completed,
      }
      return [...otherTodos, newTodo]
    }
    default:
      return state
  }
}

export default todos
