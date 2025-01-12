import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import SaveIcon from '@mui/icons-material/Save';

const adminMenuItems = [
    {
        label: "Users",
        href: `/management/user`,
        icon: ManageAccountsIcon
    },
    {
        label: "Devices",
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
        label: "Departments",
        href: `/management/department`,
        icon: Diversity2Icon,
    },
    { 
        label: "Software",
        href: `/management/software`,
        icon: SaveIcon,
    },
]

export default adminMenuItems