import {ActionCreatorsMapObject, AnyAction, bindActionCreators, combineReducers} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {ActionsTypesAppReducer, appReducer, initialiseAppWorkerSaga} from './app-reducer'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {tasksReducer} from "../FEATURES/TodolistsList/task-reducer";
import {ActionsTypesTodolistsReducer, todolistsReducer} from "../FEATURES/TodolistsList/todolists-reducer";
import {authReducer} from "../FEATURES/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useMemo} from "react";
import createSagaMiddleware from 'redux-saga';
import { takeEvery } from 'redux-saga/effects'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const sagaMiddleware = createSagaMiddleware()


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware, sagaMiddleware)
})

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield takeEvery('INITIALIZE-APP', initialiseAppWorkerSaga)
}



export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, /*AppActionsTypes*/ AnyAction>
export const useAppDispatch: () => ThunkDispatch<AppRootStateType, void, AppActionsTypes> = useDispatch

type AppActionsTypes = ActionsTypesAppReducer
    // | ActionsTypesAuthReducer
    // | ActionsTypesTasksReducer
    | ActionsTypesTodolistsReducer


export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
    const dispatch = useAppDispatch()

    const bindActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return bindActions
}


// @ts-ignore
window.store = store;
