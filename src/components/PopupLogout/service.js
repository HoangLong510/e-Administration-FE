import axios from '~/axios'

export const logoutApi = async () => {
    try {
        const res = await axios.get('/auth/logout')
        return res.data
    } catch (error) {
        return {
            success: false
        }
    }
}