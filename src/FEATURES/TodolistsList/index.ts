import {asyncActions as taskAsyncActions} from './task-reducer'
import {asyncActions as todolistAsyncActions} from './todolists-reducer'
import {slice} from "./todolists-reducer"



const todolistActions = {
    ...todolistAsyncActions,
    ...slice.actions
}

const taskActions = {
    ...taskAsyncActions
}


export {
    taskActions,
    todolistActions
}