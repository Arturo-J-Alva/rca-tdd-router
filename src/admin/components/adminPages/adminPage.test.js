import React from 'react';
import { screen } from '@testing-library/react'
import AdminPage from './adminPages';
import { AuthContext } from '../../../utils/contexts/authContext';
import { renderWithRouter } from '../../../utils/test';

describe('When the admin page is mounted', () => {

    test('Must display the admin username', () => {
        renderWithRouter(<AuthContext.Provider value={{ user: { username: 'Jhon Doe' } }}>
            <AdminPage />
        </AuthContext.Provider>)

        expect(screen.getByText(/jhon doe/i)).toBeInTheDocument()
    })

})
