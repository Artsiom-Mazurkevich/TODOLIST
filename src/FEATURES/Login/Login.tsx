import React from "react"
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {FormikConfig, FormikHelpers, useFormik} from "formik";
import {Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../APP/store";
import {loginTC} from "./auth-reducer";

type FormikErrorType = {
    email?:string
    password?:string
    rememberMe?:boolean
}

type FormikValuesType = {
    email:string
    password:string
    rememberMe:boolean
}


export const Login = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()
    const formik = useFormik({
        validate:(values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z\d._%+-]+@[A-Z\d.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 4 || values.password.length > 20 ) {
                errors.password = 'Invalid password';
            }
            return errors;
        },
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        onSubmit: async (values:FormikValuesType, formikHelpers:FormikHelpers<FormikValuesType>) => {
            const res = await dispatch(loginTC(values))
            formikHelpers.setFieldError('email', 'fake Error')
            // alert(JSON.stringify(values));
        },
    });

    if(isLoggedIn){
        return <Navigate to={"/"}/>
    }

    return <Grid container justifyContent={"center"}>
        <Grid item justifyContent={"center"}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel={"noreferrer"}>here</a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...formik.getFieldProps("email")}/>
                        {formik.touched.email && formik.errors.email ? <div style={{color:"red"}}>{formik.errors.email}</div> : null}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password ? <div style={{color:"red"}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={"Remember me"}
                                          name="rememberMe"
                                          control={
                                              <Checkbox {...formik.getFieldProps("rememberMe")}
                                                        checked={formik.values.rememberMe}
                                              />}

                        />
                        <Button type={"submit"} variant={"contained"}
                                color={"primary"}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
