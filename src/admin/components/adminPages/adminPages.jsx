import { useContext } from "react"
import { AuthContext } from "../../../utils/contexts/authContext"
import Typography from '@material-ui/core/Typography'
import { UserLayout } from "../../../utils/components/userLayout"

const AdminPage = () => {
    const { user } = useContext(AuthContext)
    return (
        <UserLayout user={user}>
            <Typography component="h1" variant="h5">
                Admin page
            </Typography>
        </UserLayout>
    )
}

export default AdminPage