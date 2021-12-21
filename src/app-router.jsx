import React from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { LoginPage } from './auth/components/loginPage'
import { PrivateRoute } from './utils/components/privateRoute'
import { EmployeePage } from './admin/components/employeePage'
import { AdminPages } from './admin/components/adminPages'
import { ADMIN_ROLE } from './consts'

export const AppRouter = () => {

    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <LoginPage />
                </Route>
                <PrivateRoute path="/admin" allowRoles={[ADMIN_ROLE]}>
                    <AdminPages />
                </PrivateRoute>
                <PrivateRoute path="/employee">
                    <EmployeePage />
                </PrivateRoute>
            </Switch>
        </Router>
    )
}

export default {
    AppRouter,
}