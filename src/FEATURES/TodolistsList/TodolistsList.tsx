import React, {useEffect} from "react"
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";
import {AddItemForm} from "../../COMPONENTS/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {useActions, useAppSelector} from "../../APP/store";
import {todolistActions} from "./index";


export const TodolistsList = () => {

    const todolists = useAppSelector(state => state.todolists)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const tasks = useAppSelector(state => state.tasks)


    const {fetchTodolists, addTodolist,} = useActions(todolistActions)


    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [isLoggedIn])


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
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
