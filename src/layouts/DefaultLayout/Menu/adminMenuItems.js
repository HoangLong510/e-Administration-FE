import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import FeedbackIcon from '@mui/icons-material/Feedback'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';

const adminMenuItems = [
    {
        label: "Users",
        href: `/management/user`,
        icon: ManageAccountsIcon
    },
    {
        label: "Feedbacks",
        href: `/management/feedback`,
        icon: FeedbackIcon
    },
    {
        label: "Divices",
        href: `/management/divice`,
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
]

export default adminMenuItems