import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded'

const menuItems = [
    {
        label: "Homepage",
        href: `/`,
        icon: HomeRoundedIcon,
        role: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff",
            "Student",
            "User"
        ]
    },
    {
        label: "Tasks",
        href: `/task`,
        icon: AssignmentRoundedIcon,
        role: [
            "Admin",
            "TechnicalStaff"
        ]
    },
    {
        label: "Schedule",
        href: `/schedule`,
        icon: CalendarMonthRoundedIcon,
        role: [
            "Admin",
            "Instructor",
            "Student",
        ]
    },
    {
        label: "Labs",
        href: `/management/lab`,
        icon: DesktopWindowsRoundedIcon,
        role: [
            "Admin",
            "Instructor",
            "Student",
        ]
    },
]

export default menuItems