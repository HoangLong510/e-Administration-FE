import axios from '~/axios'

export const fetchUserApi = async () => {
    try {
        const res = await axios.get('/auth/fetch-user')
        return res.data
    } catch (error) {
        if (error.response) {
            return {
                success: false
            }
        }
        return {
            success: false,
            error: {
                server: true
            }
        }
    }
}