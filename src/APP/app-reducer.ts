import {setIsLoggedInAC} from "../FEATURES/Login/auth-reducer";
import {authAPI} from "../API/todolist-api";
import {ThunkType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}



const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC: (state, action:PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppStatusAC: (state, action:PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppInitializedAC: (state, action:PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        },
    }
})






export const appReducer = slice.reducer
/*export const appReducer = (state: InitialStateType = initialState, action: ActionsTypesAppReducer): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":{
            return {...state, isInitialized:action.value}
        }
        default:
            return {...state}
    }
}*/





export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    //true когда приложение инициализировалось
    isInitialized: boolean
}









export const {setAppErrorAC, setAppStatusAC, setAppInitializedAC} = slice.actions
/*export const setAppErrorAC = slice.actions.setAppErrorAC;   // (error: string | null) => ({type: "APP/SET-ERROR", error} as const)
export const setAppStatusAC = slice.actions.setAppStatusAC;  // (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppInitializedAC = slice.actions.setAppInitializedAC; // (value: boolean) => ({type: "APP/SET-IS-INITIALIZED", value} as const)*/

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>












export const initialiseAppTC = ():ThunkType => dispatch => {
    authAPI.me()
        .then(res => {
            if(res.data.resultCode === 0){
                dispatch(setIsLoggedInAC({value: true}))
            }
            dispatch(setAppInitializedAC({value: true}))
        })
}

export type ActionsTypesAppReducer =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | SetAppInitializedActionType
    // | SetIsLoggedIn