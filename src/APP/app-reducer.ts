import {setIsLoggedInAC} from "../FEATURES/Login/auth-reducer";
import {authAPI, ResponseType} from "../API/todolist-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { put, CallEffect, PutEffect } from "redux-saga/effects";
import {call} from "redux-saga/effects";
import {AxiosResponse} from "axios";
import {AnyAction} from "redux";

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}




export function* initialiseAppWorkerSaga(): Generator<CallEffect<AxiosResponse<ResponseType<{ id: number; email: string; login: string; }>>> | PutEffect<AnyAction>,void,AxiosResponse<ResponseType<{id: number; email:string; login:string }>>> {
    try {
        const res = yield call(authAPI.me)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC({value: true}))
        }
    }
    catch (e) {
        console.log(e)
    }
}

export const initializeApp = () => ({type: 'INITIALIZE-APP'})


// export const initialiseAppTC = createAsyncThunk('app/initialise', async (param, {dispatch}) => {
//     try {
//         const res = await authAPI.me()
//         if (res.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: true}))
//         }
//     }
//     catch (e) {
//         console.log(e)
//     }
// })


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeApp().type, (state) => {
            if (initializeApp().type) state.isInitialized = true
            // if (initializeApp().type) state.isInitialized = true
        })
    },
})


export const appReducer = slice.reducer



export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    //true когда приложение инициализировалось
    isInitialized: boolean
}


export const {setAppErrorAC, setAppStatusAC} = slice.actions
/*export const setAppErrorAC = slice.actions.setAppErrorAC;   // (error: string | null) => ({type: "APP/SET-ERROR", error} as const)
export const setAppStatusAC = slice.actions.setAppStatusAC;  // (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppInitializedAC = slice.actions.setAppInitializedAC; // (value: boolean) => ({type: "APP/SET-IS-INITIALIZED", value} as const)*/

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type initializeAppWorkerSaga = ReturnType<typeof initializeApp>


export type ActionsTypesAppReducer =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | initializeAppWorkerSaga


