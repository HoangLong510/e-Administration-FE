import DefaultLayout from "~/layouts/DefaultLayout"
import Lab from "~/pages/management/lab/Lab"
import CreateUser from "~/pages/management/user/CreateUser"
import Class from "~/pages/management/class/class"
import User from "~/pages/management/user/User"
import EditUser from "~/pages/management/user/EditUser"
import Department from "~/pages/management/department/Department"
import ListUser from "~/pages/management/Class/ListUser"
import  Devices  from "~/pages/management/devices/Devices"
import AddDevices from "~/pages/management/devices/AddDevices"
import Software from "~/pages/management/software/Software"
import AddSoftware from "~/pages/management/software/AddSoftwares"
import LabDevices from "~/pages/management/labDevice/LabDevice"
import AddToLab from "~/pages/management/labDevice/AddtoLab"
import AddDocument from "~/pages/management/document/AddDocument"
import Document from "~/pages/management/document/Documents"


const adminRoutes = [
    { path: '/management/user', component: User, layout: DefaultLayout },
    { path: '/management/lab', component: Lab, layout: DefaultLayout },
    { path: '/management/user/create', component: CreateUser, layout: DefaultLayout },
    { path: '/management/user/edit/:userId', component: EditUser, layout: DefaultLayout },
    { path: '/management/department', component: Department, layout: DefaultLayout },
    { path: "/management/class/:classId/users", component: ListUser, layout: DefaultLayout },
    // { path: '/management/feedback', component: Feedbacks, layout: DefaultLayout },
    { path: '/management/class', component: Class, layout: DefaultLayout },
    { path: '/management/devices', component: Devices, layout: DefaultLayout },
    { path: '/management/devices/add-devices', component: AddDevices, layout: DefaultLayout },
    { path:'/management/devices/add-devices/:id?', component: AddDevices, layout: DefaultLayout },
    { path:'/management/software/add-software/:id?', component: AddSoftware, layout: DefaultLayout },
    { path: '/management/software', component: Software, layout: DefaultLayout },
    { path: '/management/software/add-software', component: AddSoftware, layout: DefaultLayout },
    { path: '/management/document', component: Document, layout: DefaultLayout },
    { path: '/management/document/add-document', component: AddDocument, layout: DefaultLayout },
    { path: '/management/labdevice/add-to-lab/:labId', component: AddToLab, layout: DefaultLayout },
    { path:'/management/labdevice/:labId', component: LabDevices, layout: DefaultLayout },
]

export default adminRoutes