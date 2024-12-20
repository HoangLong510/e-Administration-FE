import Home from "~/pages/home/Home"
import DefaultLayout from "~/layouts/DefaultLayout"
import Profile from "~/pages/auth/profile/Profile"

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
        path: '/profile',
        component: Profile,
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