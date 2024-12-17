import DefaultLayout from "~/layouts/DefaultLayout"
import CreateUser from "~/pages/management/user/CreateUser"
import User from "~/pages/management/user/User"


const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout },
    { path: '/management/user/create', component: CreateUser, layout: DefaultLayout }
]

export default adminRoutes