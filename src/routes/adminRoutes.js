import DefaultLayout from "~/layouts/DefaultLayout"
import Lab from "~/pages/management/lab/Lab"
import User from "~/pages/management/user/User"


const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout },
    { path: '/management/lab', component: Lab, layout: DefaultLayout }
]

export default adminRoutes