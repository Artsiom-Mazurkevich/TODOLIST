import {authAPI, LoginParamType} from "../../API/todolist-api";
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../APP/app-reducer";
import {handleServerAppError} from "../../UTILS/error-utils";
import {ThunkType} from "../../APP/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// type initialStateType = {
//     isLoggedIn: boolean
// }
const initialState = {
    isLoggedIn: false
}



const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedInAC (state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
})
export const authReducer = slice.reducer
// export const authReducer = (state: initialStateType = initialState, action: ActionsTypesAuthReducer): initialStateType => {
//     switch (action.type) {
//         case "'login/SET-IS-LOGGED-IN":{
//             return {...state, isLoggedIn: action.value}
//         }
//         default:
//             return state
//     }
// }




// export type SetIsLoggedIn = ReturnType<typeof setIsLoggedInAC>
/*export type ActionsTypesAuthReducer = | SetIsLoggedIn
    | SetAppStatusActionType
    | SetAppErrorActionType*/


// actions
// export const setIsLoggedInAC = (value: boolean) => ({type:"'login/SET-IS-LOGGED-IN", value} as const)
export const {setIsLoggedInAC} = slice.actions






// thunks
export const loginTC = (data:LoginParamType): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error)=>{
            dispatch(setAppErrorAC(error.message))
        })
        .finally(()=>{
            dispatch(setAppStatusAC("failed"))
        })
}
export const logOutTC = (): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error)=>{
            dispatch(setAppErrorAC(error.message))
        })
        .finally(()=>{
            dispatch(setAppStatusAC("failed"))
        })

}

