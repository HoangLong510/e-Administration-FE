import Home from "~/pages/home/Home"
import DefaultLayout from "~/layouts/DefaultLayout"

const protectedRoutes = [
    {
        path: '/',
        component: Home,
        layout: DefaultLayout,
        roles: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff",
            "Student"
        ]
    }
]

export default protectedRoutes