import { useContext } from "react"
import { AuthContext } from "../../../utils/contexts/authContext"
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { ADMIN_ROLE } from "../../../consts"

import { UserLayout } from "../../../utils/components/userLayout"

const EmployeePage = () => {
    const { user } = useContext(AuthContext)

    return (
        <UserLayout user={user}>
            <Typography component="h1" variant="h5">
                Employee page
            </Typography>
            {
                user.role === ADMIN_ROLE && <Button type="button">Delete</Button>
            }
        </UserLayout>
    )
}
export default EmployeePage