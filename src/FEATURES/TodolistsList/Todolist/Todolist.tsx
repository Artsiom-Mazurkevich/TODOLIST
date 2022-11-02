import React, {useCallback, useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task';
import {TodolistDomainType} from '../todolists-reducer';
import {EditableSpan} from "../../../COMPONENTS/EditableSpan/EditableSpan";
import {TaskStatuses, TaskType} from "../../../API/todolist-api";
import {AddItemForm} from "../../../COMPONENTS/AddItemForm/AddItemForm";
import {useActions, useAppSelector} from "../../../APP/store";
import {taskActions, todolistActions} from "../index";


type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist = React.memo(function (props: PropsType) {
    console.log('Todolist called')
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)


    const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistActions)
    const { addTask, updateTask, fetchTasks, removeTask } = useActions(taskActions)


    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])



    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        updateTask({taskId: id, domainModel: {status}, todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})
    }, [])


    const addTaskHandler = useCallback((title: string) => {
        addTask({title, todolistId: props.todolist.id})
    }, [props.todolist.id])

    const removeTodolistHandler = () => {
        removeTodolist(props.todolist.id)
    }
    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title})
    }, [props.todolist.id])

    const onAllClickHandler = useCallback(() => changeTodolistFilter({filter: 'all', id: props.todolist.id}), [props.todolist.id])
    const onActiveClickHandler = useCallback(() => changeTodolistFilter({filter: 'active', id: props.todolist.id}), [props.todolist.id])
    const onCompletedClickHandler = useCallback(() => changeTodolistFilter({filter: 'completed', id: props.todolist.id}), [props.todolist.id])


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id}
                                                task={t}
                                                todolistId={props.todolist.id}
                                                removeTask={removeTask}
                                                changeTaskTitle={changeTaskTitle}
                                                changeTaskStatus={changeStatus}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


