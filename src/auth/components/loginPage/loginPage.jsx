import {
    Button, CircularProgress, TextField, Snackbar, CssBaseline, Container,
    Typography, Avatar, makeStyles
} from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router'
import { ADMIN_EMPLOYEE, ADMIN_ROLE } from '../../../consts'
import { login } from '../../services'
import { AuthContext } from '../../../utils/contexts/authContext'
import { validateEmail, validatePassword } from '../../../utils/helpers'

const passwordValidationsMsg =
    'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

export const LoginPage = () => {
    const classes = useStyles()
    const { handleSuccessLogin: onSuccessLogin, user } = useContext(AuthContext)
    const [emailValidationMsg, setEmailValidationMsg] = useState("")
    const [passwordValidationMsg, setPasswordValidationMsg] = useState("")
    const [formValues, setFormValues] = useState({ email: '', password: '' })
    const [isFetching, setIsFetching] = useState(false)
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const validateForm = () => {
        const { email, password } = formValues

        if (!email) {
            setEmailValidationMsg('The email is required')
        }

        if (!password) {
            setPasswordValidationMsg('The password is required')
        }

        return !email || !password
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()

        if (validateForm()) return

        const { email, password } = formValues

        try {
            setIsFetching(true)

            const response = await login({ email, password })

            if (!response.ok) {
                throw response
            }

            const { user: { role, username } } = await response.json()
            onSuccessLogin({ role, username })
        } catch (error) {
            const data = await error.json()
            setErrorMessage(data.message)
            setOpen(true)

        } finally {
            setIsFetching(false)
        }

    }

    const handleChange = (ev) => {
        const { target: { value, name } } = ev
        setFormValues({ ...formValues, [name]: value })
    }

    const handleBlurEmail = () => {

        if (!validateEmail(formValues.email)) {
            setEmailValidationMsg('The email is invalid. Example: jhon.edu@test.com')
            return
        }
        setEmailValidationMsg('')
    }

    const handleBlurPass = () => {

        if (!validatePassword(formValues.password)) {
            setPasswordValidationMsg(passwordValidationsMsg)
            return
        }
        setPasswordValidationMsg("")
    }

    if (!isFetching && user.role === ADMIN_ROLE) {
        return <Redirect to="/admin" />
    }

    if (!isFetching && user.role === ADMIN_EMPLOYEE) {
        return <Redirect to="/employee" />
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper} >
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login Page
                </Typography>
                {isFetching && <CircularProgress data-testid="loading-indicator" />}
                <form onSubmit={handleSubmit}  >
                    <TextField
                        label="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlurEmail}
                        helperText={emailValidationMsg}
                        error={!!emailValidationMsg} />
                    <TextField
                        label="password"
                        id="password"
                        name="password"
                        type="password"
                        value={formValues.password}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlurPass}
                        helperText={passwordValidationMsg}
                        error={!!passwordValidationMsg} />

                    <Button type="submit" disabled={isFetching}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Send
                    </Button>
                </form>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={errorMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            />
        </Container>
    )
}

export default LoginPage
