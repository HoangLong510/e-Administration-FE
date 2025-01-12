import Schedule from "~/pages/schedule/Schedule"
import DefaultLayout from "~/layouts/DefaultLayout"
import Profile from "~/pages/auth/profile/Profile"
import Report from "~/pages/auth/report/Report"
import ListReport from "~/pages/auth/report/ListReport"
import ChangePassword from "~/pages/auth/profile/ChangePassword"
import ReportDetails from "~/pages/auth/report/ReportDetails"
import Task from "~/pages/task/Task"
import CreateTask from "~/pages/task/CreateTask"
import TaskDetail from "~/pages/task/TaskDetail"
import Dashboard from "~/pages/dashboard/Dashboard"
import EditTask from "~/pages/task/EditTask"

const protectedRoutes = [
    {
        path: '/dashboard',
        component: Dashboard,
        layout: DefaultLayout,
        roles: [
            "Admin"
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
    },

    {
        path: '/profile',
        component: Profile,
        layout: DefaultLayout,
        roles: [
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
    },

    {
        path: '/task',
        component: Task,
        layout: DefaultLayout,
        roles: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff"
        ]
    },

    {
        path: '/create-task',
        component: CreateTask,
        layout: DefaultLayout,
        roles: [
            "Admin"
        ]
    },

    {
        path: '/task-detail/:taskId',
        component: TaskDetail,
        layout: DefaultLayout,
        roles: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff"
        ]
    },

    {
        path: '/edit-task/:taskId',
        component: EditTask,
        layout: DefaultLayout,
        roles: [
            "Admin"
        ]
    },
]

export default protectedRoutes