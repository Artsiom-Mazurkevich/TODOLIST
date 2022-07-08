import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {ActionsTypesAppReducer, appReducer} from './app-reducer'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ActionsTypesTasksReducer, tasksReducer} from "../FEATURES/TodolistsList/task-reducer";
import {ActionsTypesTodolistsReducer, todolistsReducer} from "../FEATURES/TodolistsList/todolists-reducer";
import {ActionsTypesAuthReducer, authReducer} from "../FEATURES/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth:authReducer
})
export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsTypes>
export const useAppDispatch: () => ThunkDispatch<AppRootStateType, void, AppActionsTypes> = useDispatch

type AppActionsTypes = ActionsTypesAppReducer
    | ActionsTypesAuthReducer
    | ActionsTypesTasksReducer
    | ActionsTypesTodolistsReducer

// @ts-ignore
window.store = store;