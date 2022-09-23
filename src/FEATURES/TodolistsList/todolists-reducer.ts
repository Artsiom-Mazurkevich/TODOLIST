import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../APP/app-reducer"
import {todolistsAPI, TodolistType} from "../../API/todolist-api";
import {ThunkType} from "../../APP/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "../../UTILS/error-utils";



// thunks

// export const fetchTodolistsTC_ = (): ThunkType => {
//     return dispatch => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistsAC({todolists: res.data}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//             .catch((error) => {
//                 dispatch(setAppErrorAC(error.message))
//             })
//             .finally(() => {
//                 dispatch(setAppStatusAC({status: "failed"}))
//             })
//     }
// }


export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param,thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        thunkAPI.dispatch(setAppStatusAC({status:'succeeded'}))
        return {todolists: res.data}
    }
    catch (e: any) {
        const error: AxiosError = e
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})





// export const removeTodolistTC = (todolistId: string): ThunkType => {
//     return dispatch => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(setAppStatusAC({status: 'loading'}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(changeTodolistEntityStatusAC({id:todolistId, status: 'loading'}))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//                 dispatch(removeTodolistAC({id: todolistId}))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//             .catch((error) => {
//                 dispatch(setAppErrorAC(error.message))
//             })
//             .finally(() => {
//                 dispatch(setAppStatusAC({status: "failed"}))
//             })
//     }
// }

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id:todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    }
    catch (e: any) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})



export const addTodolistTC = (title: string): ThunkType => {
    return dispatch => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch((error) => {
                dispatch(setAppErrorAC(error.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC({status: "failed"}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): ThunkType => {
    return dispatch => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id:id, title: title}))
            })
            .catch((error) => {
                dispatch(setAppErrorAC(error.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC({status: "failed"}))
            })
    }
}


export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        // removeTodolistAC: (state, action: PayloadAction<{ id: string }>) => {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     if (index > -1) {
        //         state.splice(index, 1)
        //     }
        // },
        addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        // setTodolistsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
        //     return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        // },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
    }
});

export const todolistsReducer = slice.reducer;

export const {
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions;






// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type ActionsTypesTodolistsReducer =
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


