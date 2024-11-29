import { todoService } from "../../services/todo.service.js";
import { SET_TODOS, REMOVE_TODO, UPDATE_TODO, ADD_TODO, IS_LOADING, FILTER_BY, SET_DONE_TODOS_PERCENT, SET_MAX_PAGE } from "../reducers/todo.reducer.js";
import { addActivity } from "./user.actions.js";
import { store } from "../store.js";


export function loadTodos() {
    const filterBy = store.getState().todoModule.filterBy
    store.dispatch({ type: IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(({ todos, maxPage, doneTodosPercent }) => {
            store.dispatch({
                type: SET_TODOS,
                todos
            })
            _setTodosData(doneTodosPercent, maxPage)
            return todos
        })
        .catch(err => {
            console.error('Cannot load todos:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(({ maxPage, doneTodosPercent }) => {
            store.dispatch({
                type: REMOVE_TODO,
                todoId
            })
            _setTodosData(doneTodosPercent, maxPage)
        })
        .then(() => addActivity('Removed the Todo: ' + todoId))
        .catch(err => {
            console.error('Cannot remove todo:', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = (todo._id) ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then(({ maxPage, doneTodosPercent, savedTodo }) => {
            store.dispatch({
                type,
                todo: savedTodo
            })
            _setTodosData(doneTodosPercent, maxPage)
            return savedTodo
        })
        .then(res => {
            const actionName = (todo._id) ? 'Updated' : 'Added'
            return addActivity(`${actionName} a Todo: ` + todo.txt).then(() => res)
        })
        .catch(err => {
            console.error('Cannot save todo:', err)
            throw err
        })
}

export function setFilterSort(filterBy) {
    const action = {
        type: FILTER_BY,
        filterBy,
    }
    store.dispatch(action)
}

function _setTodosData(doneTodosPercent, maxPage) {
    store.dispatch({
        type: SET_DONE_TODOS_PERCENT,
        doneTodosPercent
    })
    store.dispatch({
        type: SET_MAX_PAGE,
        maxPage
    })
}

