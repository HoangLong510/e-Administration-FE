import axios from "~/axios"

export const fetchUsersApi = async (data) => {
    try {
        const res = await axios.post('/management/user/get-users', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        }
    }
}

export const createUserApi = async (data) => {
    try {
        const res = await axios.post('/management/user/create-user', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        }
    }
}

export const disableUserApi = async (id) => {
    try {
        const res = await axios.get(`/management/user/disable/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        }
    }
}