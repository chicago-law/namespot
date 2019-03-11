import {
  Todo,
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from './types'

export const addTodo = (todo: Todo) => ({
  type: ADD_TODO,
  todo,
})

export const removeTodo = (todo: Todo) => ({
  type: REMOVE_TODO,
  todo,
})

export const toggleTodo = (todo: Todo) => ({
  type: TOGGLE_TODO,
  todo,
})
