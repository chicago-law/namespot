export interface Todo {
  task: string;
  completed: boolean;
}

export type TodosState = Todo[];

// Redux Actions
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'

export interface AddTodo {
  type: typeof ADD_TODO;
  todo: Todo;
}

export interface RemoveTodo {
  type: typeof REMOVE_TODO;
  todo: Todo;
}

export interface ToggleTodo {
  type: typeof TOGGLE_TODO;
  todo: Todo;
}

export type TodosActionTypes = AddTodo | RemoveTodo | ToggleTodo
