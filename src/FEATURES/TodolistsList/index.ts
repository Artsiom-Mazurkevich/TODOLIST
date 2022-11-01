import * as taskActions from './taskThunks'
import * as todolistAsyncActions from './todolistThunks'
import {slice} from "./todolists-reducer";



const todolistActions = {
    ...todolistAsyncActions,
    ...slice.actions
}


export {
    taskActions,
    todolistActions
}