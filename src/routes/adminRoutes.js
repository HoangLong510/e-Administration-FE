import DefaultLayout from "~/layouts/DefaultLayout"
import Lab from "~/pages/management/lab/Lab"
import CreateUser from "~/pages/management/user/CreateUser"
import Class from "~/pages/management/class/class"
import User from "~/pages/management/user/User"
import EditUser from "~/pages/management/user/EditUser"
import DocumentList from "~/pages/management/Document/DocumentList"
import Department from "~/pages/management/department/Department"
import ListUser from "~/pages/management/Class/ListUser"
import  Devices  from "~/pages/management/devices/Devices"
import AddDevices from "~/pages/management/devices/AddDevices"
import Software from "~/pages/management/software/Software"
import AddSoftware from "~/pages/management/software/AddSoftwares"


const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout },
    { path: '/management/lab', component: Lab, layout: DefaultLayout },
    { path: '/management/user/create', component: CreateUser, layout: DefaultLayout },
    { path: '/management/user/edit/:userId', component: EditUser, layout: DefaultLayout },
    { path: '/management/class', component: Class, layout: DefaultLayout },
    { path: '/management/document', component: DocumentList, layout: DefaultLayout },
    { path: '/management/department', component: Department, layout: DefaultLayout },
    { path: "/management/class/:classId/users", component: ListUser, layout: DefaultLayout },
    { path: "/management/devices", component: Devices, layout: DefaultLayout },
    { path: "/management/devices/add-devices", component: AddDevices, layout: DefaultLayout },
    { path: "/management/software/add-software", component: AddSoftware, layout: DefaultLayout },
    { path: "/management/software", component: Software, layout: DefaultLayout },
]

export default adminRoutes