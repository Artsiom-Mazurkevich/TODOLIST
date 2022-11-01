import React, {useCallback, useEffect} from "react"
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";
import {AddItemForm} from "../../COMPONENTS/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {useActions, useAppDispatch, useAppSelector} from "../../APP/store";
import {TaskStatuses} from "../../API/todolist-api";
import {FilterValuesType} from "./todolists-reducer";
import {taskActions, todolistActions} from "./index";


export const TodolistsList = () => {

    const todolists = useAppSelector(state => state.todolists)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const tasks = useAppSelector(state => state.tasks)


    const dispatch = useAppDispatch()
    const {updateTaskTC, removeTaskTC, addTaskTC} = useActions(taskActions)
    const {
        fetchTodolistsTC,
        removeTodolistTC,
        changeTodolistTitleTC,
        addTodolistTC,
        changeTodolistFilterAC
    } = useActions(todolistActions)


    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolistsTC()
    }, [isLoggedIn])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        removeTaskTC({taskId, todolistId})
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskTC({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        updateTaskTC({taskId: id, domainModel: {status}, todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTaskTC({taskId: id, domainModel: {title: newTitle}, todolistId})
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        changeTodolistFilterAC({id: todolistId, filter: value})
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        removeTodolistTC(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleTC({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistTC(title)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }
    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
