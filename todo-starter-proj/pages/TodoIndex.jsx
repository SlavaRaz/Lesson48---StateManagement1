const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo, setFilterSort } from "../store/actions/todo.actions.js"
import { TodoSort } from '../cmps/TodoSort.jsx'
import { PaginationBtns } from "../cmps/PaginationBtns.jsx"
import { changeBalance } from '../store/actions/user.actions.js'
import { ADD_CAR_TO_CART, FILTER_BY } from '../store/reducers/todo.reducer.js'


export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todoModule.todos)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
    const maxPage = useSelector((storeState) => storeState.todoModule.maxPage)
    const dispatch = useDispatch()

    console.log(todos)
    useEffect(() => {
        loadTodos()
            .catch(err => {
                showErrorMsg('Cannot load todos', err)
            })
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const isDelete = confirm('are you sure to delete')
        if (!isDelete) return
        removeTodo(todoId)
            .then(() => {
                showSuccessMsg('Todo removed')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onAddTodo() {
        const todoToSve = todoService.getEmptyTodo()
        saveTodo(todoToSve)
            .then((savedTodo) => {
                showSuccessMsg(`todo added (id: ${savedTodo._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot add todo')
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then(() => {
                // setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
                showSuccessMsg(`Todo is ${(todoToSave.isDone) ? 'done' : 'back on your list'}`)
                if (todoToSave.isDone) {
                    return changeBalance(10)
                }
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    function onSetFilterSort(filterBy) {
        dispatch({ type: FILTER_BY, filterBy })
    }

    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        if (newPageIdx < 0) newPageIdx = maxPage - 1
        if (newPageIdx >= maxPage) newPageIdx = 0
        onSetFilterSort({ ...filterBy, pageIdx: newPageIdx, })
    }

    // if (isLoading) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterSort} />
            <TodoSort filterBy={filterBy} onSetFilterBy={onSetFilterSort} />
            <button onClick={onAddTodo}>Add Todo </button>
            {/* <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div> */}
            <h2>Todos List</h2>
            <PaginationBtns filterSortBy={filterBy} onChangePageIdx={onChangePageIdx} />
            {!isLoading
                ? <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                : <div>Loading...</div>
            }
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}