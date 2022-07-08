import {AnyAction, applyMiddleware, combineReducers, createStore} from 'redux'
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import {appReducer} from './app-reducer'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {tasksReducer} from "../FEATURES/TodolistsList/task-reducer";
import {todolistsReducer} from "../FEATURES/TodolistsList/todolists-reducer";
import {authReducer} from "../FEATURES/Login/auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth:authReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния

export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type DispatchThunk = ThunkDispatch <AppRootStateType, unknown, AnyAction>
export const useAppDispatch: () => DispatchThunk = useDispatch;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;