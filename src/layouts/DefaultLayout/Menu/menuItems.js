import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const menuItems = [
    {
        label: "Dasboard",
        href: `/dashboard`,
        icon: HomeRoundedIcon,
        role: [
            "Admin",
        ]
    },
    {
        label: "Tasks",
        href: `/task`,
        icon: AssignmentRoundedIcon,
        role: [
            "Admin",
            "TechnicalStaff",
            "Instructor"
        ]
    },
    {
        label: "Schedule",
        href: `/schedule`,
        icon: CalendarMonthRoundedIcon,
        role: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff",
            "Student",
        ]
    },
    {
        label: "Document",
        href: `/document`,
        icon: AutoStoriesIcon,
        role: [
            "Admin",
            "Instructor",
            "Student",
        ]
    },
    {
        label: "Reports",
        href: `/report`,
        icon: ReportGmailerrorredRoundedIcon,
        role: [
            "Admin",
            "Instructor",
            "HOD",
            "TechnicalStaff",
            "Student",
            "User"
        ]
    },

    
]

export default menuItems