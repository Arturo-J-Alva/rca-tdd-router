import React from "react";
import { screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { LoginPage } from "./loginPage";
import { setupServer } from 'msw/node'
import { handlers, handlerInvalidCredentials } from '../../../mocks/handlers'
import { HTTP_UNEXPECTED_ERROR_STATUS } from '../../../consts'
import { rest } from "msw";
import { fillInputs, getSendButton, renderWithRouter } from "../../../utils/test";
import { AuthContext } from "../../../utils/contexts/authContext";

const passwordValidationsMsg =
    'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const server = setupServer(...handlers)

beforeEach(() => renderWithRouter(
    <AuthContext.Provider value={{ handleSuccessLogin: jest.fn(), user: { role: 'anyrole' } }}>
        <LoginPage />
    </AuthContext.Provider>
))

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('When Login page is mounted', () => {
    test('Must display the login title', () => {

        expect(screen.getByRole("heading", { name: /login page/i })).toBeInTheDocument()
    })

    test('Must have a form with the following fields: email, password and a submit button', () => {

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument()
    })

})

describe('When the user leaves empty fields and clicks the submit button', () => {

    test('Should display required messages as the format: “The [field name] is required” ', async () => {

        expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the Password is required/i)).not.toBeInTheDocument()

        fireEvent.click(getSendButton())

        expect(screen.queryByText(/the email is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the Password is required/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /send/i })).not.toBeDisabled()
        })
    })

})

describe('When the user fills the fields and clicks the submit button', () => {

    test('Should not display required messages', async () => {

        fillInputs()

        fireEvent.click(getSendButton())

        expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the Password is required/i)).not.toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /send/i })).not.toBeDisabled()
        })
    })

})

describe('When the user fills and blur the email input with invalid email, and then focus and change with valid value', () => {

    test('should display a validation message “The email is invalid. Example: jhon.edu@test.com', () => {
        const emailInput = screen.getByLabelText(/email/i)
        fireEvent.change(emailInput, { target: { value: 'invalid.email' } })
        fireEvent.blur(emailInput)

        expect(screen.getByText(/The email is invalid. Example: jhon.edu@test.com/i)).toBeInTheDocument()

        fireEvent.change(emailInput, { target: { value: 'pinto@timitree.com' } })
        fireEvent.blur(emailInput)

        expect(screen.queryByText(/The email is invalid. Example: jhon.edu@test.com/i)).not.toBeInTheDocument()

    })

})

describe('When the user fills and blur the password input with a value with 7 character length', () => {

    test('must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
        const emailPassword = screen.getByLabelText(/password/i)
        fireEvent.change(emailPassword, { target: { value: 'retfsj3' } })
        fireEvent.blur(emailPassword)

        expect(screen.getByText(passwordValidationsMsg)).toBeInTheDocument()
    })

})

describe('When the user fills and blur the password input with a value without one upper case character', () => {

    test('must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
        const emailPassword = screen.getByLabelText(/password/i)
        fireEvent.change(emailPassword, { target: { value: '4t52ft4r' } })
        fireEvent.blur(emailPassword)

        expect(screen.getByText(passwordValidationsMsg)).toBeInTheDocument()
    })

})

describe('When the user fills and blur the password input with a value without one number', () => {

    test('Must display the validation message "The password must contain at least 8 characters, one upper case letter, one number and one special character"', () => {
        const emailPassword = screen.getByLabelText(/password/i)
        fireEvent.change(emailPassword, { target: { value: 'rTaerererY' } })
        fireEvent.blur(emailPassword)

        expect(screen.getByText(passwordValidationsMsg)).toBeInTheDocument()
    })

})

describe('When the user fills and blur the password input with without one special character and then change with valid value and blur again', () => {

    test('must not display the validation message', () => {
        const passwordWithoutSpecialChar = 'asdfghjA1a'
        const validPassword = 'aA1asdasda#'

        const emailPassword = screen.getByLabelText(/password/i)
        fireEvent.change(emailPassword, { target: { value: passwordWithoutSpecialChar } })
        fireEvent.blur(emailPassword)

        expect(screen.getByText(passwordValidationsMsg)).toBeInTheDocument()

        fireEvent.change(emailPassword, { target: { value: validPassword } })
        fireEvent.blur(emailPassword)

        expect(screen.queryByText(passwordValidationsMsg)).not.toBeInTheDocument()
    })

})

describe('when the user submit the login form with valid data', () => {
    test('must disable the submit button while the form page is fetching the data', async () => {

        fillInputs()

        const button = screen.getByRole("button", { name: /send/i })

        fireEvent.click(button)

        expect(button).toBeDisabled()

        await waitFor(() => {
            expect(button).not.toBeDisabled()
        })
    })


    test('must be a loading indicator at the top of the form while it is fetching', async () => {
        const loadingElement = screen.queryByTestId("loading-indicator")

        expect(loadingElement).not.toBeInTheDocument()

        fillInputs()

        const button = screen.getByRole("button", { name: /send/i })

        fireEvent.click(button)

        expect(screen.queryByTestId("loading-indicator")).toBeInTheDocument()

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId("loading-indicator")
        )
    })

})

describe('when the user submit the login form with valid data and there is an unexpected server error', () => {

    test('must display the error message "Unexpected error, please try again" from the api', async () => {

        server.use(
            rest.post('/login', (req, res, ctx) => res(
                ctx.status(HTTP_UNEXPECTED_ERROR_STATUS),
                ctx.json({ message: 'Unexpected error, please try again' })
            )),
        )

        expect(screen.queryByText(/unexpected error, please try again/i)).not.toBeInTheDocument()

        fillInputs()

        const button = screen.getByRole("button", { name: /send/i })
        fireEvent.click(button)

        expect(await screen.findByText(/unexpected error, please try again/i)).toBeInTheDocument()
    })

})

describe('when the user submit the login form with valid data and there is an invalid credentials error', () => {

    test('must display the error message "The email or password are not correct" from the api', async () => {

        const wrongEmail = 'wrong@mail.com'
        const wrongPassword = 'Aa12345678$'

        server.use(handlerInvalidCredentials({ wrongEmail, wrongPassword }))

        expect(
            screen.queryByText(/the email or password are not correct/i),
        ).not.toBeInTheDocument()

        fillInputs({ email: wrongEmail, password: wrongPassword })
        fireEvent.click(getSendButton())

        expect(
            await screen.findByText(/the email or password are not correct/i),
        ).toBeInTheDocument()

    })

})








