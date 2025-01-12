const regex = {
    fullName: {
        pattern: /^(?!\s)[a-zA-Z\u0080-\uFFFF\s]{2,50}(?<!\s)$/u,
        message: "Full name must be between 2 and 50 characters and not contain any special characters"
    },
    username: {
        pattern: /^[a-z][a-z0-9_]{4,19}$/,
        message: "Username must be between 5 and 20 characters. Must start with a lowercase letter"
    },
    phone: {
        pattern: /^(0|\+84)(\s|\.)?((3[2-9])|(5[26-9])|(7[0|6-9])|(8[0-9])|(9[0-9]))(\d){7}$/,
        message: "Phone number must be in the format +84909123123 or 0909123123"
    },
    password: {
        pattern: /^.{6,30}$/,
        message: "Password must be between 6 and 30 characters"
    },
    email: {
        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "Email address is not valid"
    },
    address: {
        pattern: /^(?!\s|[,.-])[a-zA-Z0-9\u0080-\uFFFF\s,.-]{6,100}(?<!\s|[,.-])$/,
        message: "Address must be between 6 and 100 characters and can only include letters, numbers, commas, periods, and hyphens"
    },
    className: {
        pattern: /^.{5,}$/,
        message: "Class name must be at least 5 characters long"
    }
}

export default regex