import { todoService } from '../../services/todo.service.js'


//* Todos
export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

export const IS_LOADING = 'IS_LOADING'
export const FILTER_BY = 'FILTER_BY'
export const SET_DONE_TODOS_PERCENT = 'SET_DONE_TODOS_PERCENT'
export const SET_MAX_PAGE = 'SET_MAX_PAGE'


const initialState = {
    todos: [],
    isLoading: false,
    filterBy: todoService.getDefaultFilter(),
    doneTodosPercent: 0,
    maxPage: 0,
}

export function todoReducer(state = initialState, cmd = {}) {

    switch (cmd.type) {
        //* TODOS
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, cmd.todo]
            }

        case REMOVE_TODO:
            console.log(cmd)
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId)
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }

        case IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        case FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...cmd.filterBy }
            }

        case SET_DONE_TODOS_PERCENT:
            return { ...state, doneTodosPercent: cmd.doneTodosPercent }

        case SET_MAX_PAGE:
            return { ...state, maxPage: cmd.maxPage }

        default:
            return state
    }
}


