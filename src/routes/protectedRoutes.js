import Home from "~/pages/home/Home"
import Schedule from "~/pages/schedule/Schedule"
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
    },
    {
        path: '/schedule',
        component: Schedule,
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