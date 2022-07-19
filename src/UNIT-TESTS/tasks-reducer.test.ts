import {
    addTaskAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from "../FEATURES/TodolistsList/task-reducer";
import {TaskPriorities, TaskStatuses} from "../API/todolist-api";


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