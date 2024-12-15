import DefaultLayout from "~/layouts/DefaultLayout"
import User from "~/pages/management/user/User"


const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout }
]

export default adminRoutes