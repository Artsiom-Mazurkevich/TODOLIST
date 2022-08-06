import {
    addTodolistAC, changeTodolistEntityStatusAC, changeTodolistFilterAC, changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "../FEATURES/TodolistsList/todolists-reducer";
import {v1} from "uuid";
import {TodolistType} from "../API/todolist-api";
import {RequestStatusType} from "../APP/app-reducer";


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', order: 1, addedDate: '', entityStatus: 'idle', filter: 'all'},
        {id: todolistId2, title: 'What to buy', order: 2, addedDate: '', entityStatus: 'idle', filter: 'all'},
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC({id: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})



test('correct todolist should be added', () => {
    const todolist: TodolistType = {
        id: '3333',
        addedDate: '',
        order: 3,
        title: 'newList'
    }

    const endState = todolistsReducer(startState, addTodolistAC({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe('3333')
})


test('correct todolist should change its name', () => {
    const title = 'Hello world'
    const endState = todolistsReducer(startState, changeTodolistTitleAC({id: todolistId1, title}))
    expect(endState[0].title).toBe(title)
    expect(endState[1].title).toBe('What to buy')
})


test('correct filter of todolist should be changed', () => {
    const filter:FilterValuesType = 'completed'
    const endState = todolistsReducer(startState, changeTodolistFilterAC({id: todolistId1, filter}))

    expect(endState[0].filter).toBe(filter)
    expect(endState[1].filter).toBe('all')
})



test('todolists should be added', () => {
    const endState = todolistsReducer([], setTodolistsAC({todolists: startState}))
    expect(endState.length).toBe(2)
})



test('correct entity status of todolist should be changed', () => {
    const status: RequestStatusType = 'loading'
    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({id: todolistId1, status}))

    expect(endState[0].entityStatus).toBe(status)
    expect(endState[1].entityStatus).toBe('idle')
})