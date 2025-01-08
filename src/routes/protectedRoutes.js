import Home from "~/pages/home/Home"
import DefaultLayout from "~/layouts/DefaultLayout"
import Profile from "~/pages/auth/profile/Profile"
import Report from "~/pages/auth/report/Report"
import ListReport from "~/pages/auth/report/ListReport"
import ChangePassword from "~/pages/auth/profile/ChangePassword"
import ReportDetails from "~/pages/auth/report/ReportDetails"
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
    },

    {
        path: '/report',
        component: ListReport,
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
        path: '/create-report',
        component: Report,
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
        path: '/report-details/:id',
        component: ReportDetails,
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
        path: '/changepassword',
        component: ChangePassword,
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