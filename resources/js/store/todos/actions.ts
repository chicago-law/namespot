import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import axios, { AxiosResponse } from 'axios'
import {
  Todo,
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from './types'
import { AppState } from '..'

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

export const saveAndToggleTodo = (
  todo: Todo,
): ThunkAction<void, AppState, null, Action<string>> => (dispatch) => {
  axios.get('http://192.170.208.192/api/titles')
    .then((res: AxiosResponse) => {
      dispatch(toggleTodo(res.data))
    })
    .catch(() => {
      dispatch(toggleTodo(todo))
    })
}
