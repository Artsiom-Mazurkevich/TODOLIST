import React, {useCallback, useEffect} from "react"
import './App.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Route, Routes} from "react-router-dom";
import {ErrorSnackbar} from "../COMPONENTS/ErrorSnackBar/ErrorSnackbar";
import {Menu} from "@mui/material";
import {useAppDispatch, useAppSelector} from "./store";
import {initialiseAppTC} from "./app-reducer";
import {logOutTC} from "../FEATURES/Login/auth-reducer";
import {TodolistsList} from "../FEATURES/TodolistsList/TodolistsList";
import {Login} from "../FEATURES/Login/Login";

// import {CircularProgress} from "@mui/material";


function App() {
    const status = useAppSelector((state) => state.app.status)
    const isInitialized = useAppSelector((state) => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initialiseAppTC())
    }, [dispatch])

    const logOutHandler = useCallback(() => dispatch(logOutTC()), [isLoggedIn, dispatch])

    if (!isInitialized) {
        return <LinearProgress color="secondary"/>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit"
                                aria-label="menu">
                        <Menu open={false}/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={"/"}
                           element={<TodolistsList/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path="*" element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>

            </Container>
        </div>
    )
}

export default App

