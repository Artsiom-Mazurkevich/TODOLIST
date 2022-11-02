import {TodolistType} from "../API/todolist-api";
import {
    TodolistDomainType,
    todolistsReducer
} from "../FEATURES/TodolistsList/todolists-reducer";
import {taskActions, todolistActions} from "../FEATURES/TodolistsList/index";
import {tasksReducer, TasksStateType} from "../FEATURES/TodolistsList/task-reducer";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const todolist: TodolistType = {
        id: 'new_todolist',
        order: 12,
        title: 'Hey',
        addedDate: ''
    }
    const action = todolistActions.addTodolist.fulfilled({todolist}, 'requestId', todolist.title)

    const endTaskState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTaskState);
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})