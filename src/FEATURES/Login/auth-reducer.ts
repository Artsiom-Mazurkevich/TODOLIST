import {authAPI, FieldErrorType, LoginParamType} from "../../API/todolist-api";
import {setAppErrorAC, setAppStatusAC} from "../../APP/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../UTILS/error-utils";
import {ThunkType} from "../../APP/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamType, { rejectValue: { errors: string[], fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            return {isLoggedIn: true};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            return {isLoggedIn: false};
        }
    } catch (err: any) {
        const error: AxiosError = err;
        handleServerNetworkError(error, thunkAPI.dispatch)
        thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        return {isLoggedIn: false};
    }
})

export const logOutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logOutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})


export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions




