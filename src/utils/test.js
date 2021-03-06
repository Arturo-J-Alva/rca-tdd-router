import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthGuard } from './components/authGuard'

export const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)

    return render(ui, { wrapper: Router })
}

export const renderWithAuthProvider = (ui, { isAuth = false, role = '' } = {}) => {

    return render(
        <AuthGuard isAuth={isAuth} role={role}>
            {ui}
        </AuthGuard>,
        { wrapper: Router }
    )
}

export const goTo = (route) => window.history.pushState({}, 'Test page', route)

export const fillInputs = ({
    email = 'john.doe@test.com',
    password = 'Aa123456789!@#',
} = {}) => {
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: email },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password },
    })
}

export const getSendButton = () => screen.getByRole('button', { name: /send/i })

export default {
    renderWithRouter,
    renderWithAuthProvider,
    getSendButton,
    fillInputs
}