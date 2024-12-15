import axios from "~/axios"

export const loginApi = async (user) => {
    try {
        const res = await axios.post('/auth/login', user, {
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