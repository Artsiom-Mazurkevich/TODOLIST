import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../APP/app-reducer";
import {todolistsAPI} from "../../API/todolist-api";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "../../UTILS/error-utils";
import {changeTodolistEntityStatusAC} from "./todolists-reducer";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (e: any) {
        const error: AxiosError = e
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (e: any) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: res.data.data.item}
    } catch (e: any) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (params: { id: string, title: string }, {dispatch, rejectWithValue}) => {
        try {
            const res = await todolistsAPI.updateTodolist(params.id, params.title)
            return {id: params.id, title: params.title}
        } catch (e: any) {
            const error: AxiosError = e
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })