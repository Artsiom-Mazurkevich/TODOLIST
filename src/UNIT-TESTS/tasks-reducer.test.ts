import {
    addTaskAC,
    removeTaskAC, setTasksAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from "../FEATURES/TodolistsList/task-reducer";
import {TaskPriorities, TaskStatuses} from "../API/todolist-api";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "../FEATURES/TodolistsList/todolists-reducer";


let startState: TasksStateType = {}
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '4', title: 'Angular', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
        ],
        "todolistId2": [
            {
                id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '2', title: 'milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '3', title: 'coffee', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: '4', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
        ],
    }
});


test("correct task should be deleted from correct array", () => {
    const action = removeTaskAC({taskId: '2', todolistId: 'todolistId2'})
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(4)
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId2'].every(t => t.id !== '2')).toBeTruthy()
})


test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        description: '',
        title: 'MyName',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        id: 'is exist',
        todoListId: 'todolistId2',
        order: 0,
        addedDate: ''

    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(4)
    expect(endState['todolistId2'].length).toBe(5)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('MyName')
})


test('status of specified task should be changed', () => {
    const action = updateTaskAC({taskId: '2', todolistId: 'todolistId2', model: {status: TaskStatuses.New}})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
})


test('title of specified task should be changed', () => {
    const action = updateTaskAC({taskId: '2', todolistId: 'todolistId2', model: {title: 'Hey'}})
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('Hey')
    expect(endState['todolistId1'][1].title).toBe('JS')
})


test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC({
        todolist: {
            id: 'newTodolistId',
            title: 'new todolist',
            order: 0,
            addedDate: ''
        }
    })

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')

    if (!newKey) throw Error ('new key should be added')

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})


test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC({id: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC({todolists: [
            {id: '1', title: 'one', order: 1, addedDate: ''},
            {id: '2', title: 'two', order: 2, addedDate: ''},
        ]})

    const endState = tasksReducer({}, action);

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
})

test('task should be added for todolist', () => {
    const action = setTasksAC({tasks: startState['todolistId1'], todolistId: 'todolistId1'})

    const ensState = tasksReducer({
        'todolistId2': [],
        'todolistId1': [],
    }, action)

    expect(ensState['todolistId2'].length).toBe(0)
    expect(ensState['todolistId1'].length).toBe(4)
})