import DefaultLayout from "~/layouts/DefaultLayout"
import Lab from "~/pages/management/lab/Lab"
import CreateUser from "~/pages/management/user/CreateUser"
import Class from "~/pages/management/class/class"
import User from "~/pages/management/user/User"
import EditUser from "~/pages/management/user/EditUser"

const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout },
    { path: '/management/lab', component: Lab, layout: DefaultLayout },
    { path: '/management/user/create', component: CreateUser, layout: DefaultLayout },
    { path: '/management/user/edit/:userId', component: EditUser, layout: DefaultLayout },
    { path: '/management/class', component: Class, layout: DefaultLayout }
]

export default adminRoutes