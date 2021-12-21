import { useState } from "react"
import { AuthContext } from "../contexts/authContext"
import PropTypes from 'prop-types'

export const AuthGuard = ({ children, isAuth, role: initialRole }) => {
    const [isUserAuth, setIsUserAuth] = useState(isAuth)
    const [user, setUser] = useState({ role: initialRole, username: '' })

    const handleSuccessLogin = ({ role, username }) => {
        setIsUserAuth(true)
        setUser({ role, username })
    }

    const authProviderValue = {
        isAuth: isUserAuth,
        handleSuccessLogin,
        user
    }

    return (
        <AuthContext.Provider value={authProviderValue}>
            {children}
        </AuthContext.Provider>
    )
}

AuthGuard.propTypes = {
    children: PropTypes.node.isRequired,
    isAuth: PropTypes.bool,
    role: PropTypes.string,
}

AuthGuard.defaultProps = {
    isAuth: false,
    role: ''
}

export default { AuthGuard }
