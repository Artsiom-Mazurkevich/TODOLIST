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


export const logOutTC_ = (): ThunkType => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            dispatch(setAppErrorAC(error.message))
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: "failed"}))
        })

}

export const logOutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: false}))
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {

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
    }
})
export const authReducer = slice.reducer

export const {setIsLoggedInAC} = slice.actions


// thunks
// export const loginTC = (data: LoginParamType): ThunkType => dispatch => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//                 dispatch(setAppStatusAC({status: "succeeded"}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             dispatch(setAppErrorAC(error.message))
//         })
//         .finally(() => {
//             dispatch(setAppStatusAC({status: "failed"}))
//         })
// }


