import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { AppRouter } from './app-router'
import { fillInputs, getSendButton, goTo, renderWithAuthProvider } from './utils/test'
import { handlers } from './mocks/handlers'
import { setupServer } from 'msw/node'
import { ADMIN_EMAIL, EMPLOYEE_EMAIL, ADMIN_EMPLOYEE, ADMIN_ROLE } from './consts'

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when the user is not authenticated and enters on admin page', () => {
    test('must be redirected to login page', () => {

        goTo("/admin")
        renderWithAuthProvider(<AppRouter />)

        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    })
})

describe('when the user is not authenticated and enters on employee page', () => {
    test('must be redirected to login page', () => {
        goTo("/employee")
        renderWithAuthProvider(<AppRouter />)

        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    })

})

describe('when the user is authenticated and enters on admin page', () => {
    test('must be redirected to login page', () => {
        goTo("/admin")
        renderWithAuthProvider(<AppRouter />, { isAuth: true, role: ADMIN_ROLE })

        expect(screen.getByText(/admin page/i)).toBeInTheDocument()
    })

})

describe('when the admin is authenticated in login page', () => {
    test('must be redirected to admin page', async () => {
        renderWithAuthProvider(<AppRouter />)

        fillInputs({ email: ADMIN_EMAIL })

        fireEvent.click(getSendButton())

        expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
        expect(await screen.findByText(/jhon doe/i)).toBeInTheDocument()
    })

})

describe('when the admin goes to employees page', () => {
    test('must have access', () => {
        goTo('/admin')
        renderWithAuthProvider(<AppRouter />, { isAuth: true, role: ADMIN_ROLE })

        fireEvent.click(screen.getByText(/employee/i))

        expect(screen.getByText(/^employee page/i)).toBeInTheDocument()
    })
})

describe('when the employee is authenticated in login page', () => {
    test('must be redirected to employee page', async () => {
        renderWithAuthProvider(<AppRouter />)

        fillInputs({ email: EMPLOYEE_EMAIL })

        fireEvent.click(getSendButton())

        expect(await screen.findByText(/employee page/i)).toBeInTheDocument()
    })

})

describe('when the employee goes to admin page', () => {
    test('must redirect to employee page', async () => {
        goTo('/admin')
        renderWithAuthProvider(<AppRouter />, { isAuth: true, role: ADMIN_EMPLOYEE })

        expect(screen.getByText(/employee page/i)).toBeInTheDocument()
    })

})

