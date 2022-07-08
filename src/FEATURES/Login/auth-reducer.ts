import {Dispatch} from "redux";
import {authAPI, LoginParamType} from "../../API/todolist-api";
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../APP/app-reducer";
import {handleServerAppError} from "../../UTILS/error-utils";

type initialStateType = {
    isLoggedIn: boolean
}
const initialState: initialStateType = {
    isLoggedIn: false
}

export const authReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
    switch (action.type) {
        case "'login/SET-IS-LOGGED-IN":{
            return {...state, isLoggedIn: action.value}
        }
        default:
            return state
    }
}
export type SetIsLoggedIn = ReturnType<typeof setIsLoggedInAC>
type ActionsType = | SetIsLoggedIn
    | SetAppStatusActionType
    | SetAppErrorActionType

// actions
export const setIsLoggedInAC = (value: boolean) => ({type:"'login/SET-IS-LOGGED-IN", value} as const)



// thunks
export const loginTC = (data:LoginParamType) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
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




export const logOutTC = () => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
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
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>

