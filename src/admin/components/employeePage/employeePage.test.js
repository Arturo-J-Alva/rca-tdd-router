import React from 'react'
import { screen, fireEvent, render } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/test';
import { EmployeePage } from '.';
import { AuthContext } from '../../../utils/contexts/authContext';
import { ADMIN_EMPLOYEE, ADMIN_ROLE } from '../../../consts';

const renderWith = ({ role, username = 'Jhon Doe' }) => (
    renderWithRouter(<AuthContext.Provider value={{ user: { username, role } }}>
        <EmployeePage />
    </AuthContext.Provider>)
)

describe('when the admin access to employee page', () => {
    test('must have access to delete the employee button', () => {
        renderWith({ role: ADMIN_ROLE })
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

})

describe('when the employee access to employee page', () => {
    test('must not have access to delete the employee button', () => {
        renderWith({ role: ADMIN_EMPLOYEE })

        expect(screen.queryByText('button', { name: /delete/i })).not.toBeInTheDocument()
    })

    test('the employee username should be displayed on the common navbar', () => {
        renderWith({ role: ADMIN_EMPLOYEE, username: "joana doe" })

        expect(screen.queryByText(/joana doe/i)).toBeInTheDocument()
    })


})
