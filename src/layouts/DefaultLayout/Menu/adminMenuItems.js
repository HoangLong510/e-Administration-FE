import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Diversity2Icon from '@mui/icons-material/Diversity2';


const adminMenuItems = [
    {
        label: "Users",
        href: `/management/user`,
        icon: ManageAccountsIcon
    },
    {
        label: "Divices",
        href: `/management/devices`,
        icon: DevicesRoundedIcon
    },
    {
        label: "Labs",
        href: `/management/lab`,
        icon: RoomPreferencesRoundedIcon
    },
    {
        label: "Class",
        href: `/management/class`,
        icon: ClassRoundedIcon,
    },
    {

        label: "Document",
        href: `/management/document`,
        icon: MenuBookIcon,
    },
    { 
        label: "Departments",
        href: `/management/department`,
        icon: Diversity2Icon,
    },
    { 
        label: "SoftWare",
        href: `/management/software`,
        icon: Diversity2Icon,
    },
]

export default adminMenuItems