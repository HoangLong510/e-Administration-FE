import axios from "~/axios";

export const fetchTotalUsers = async () => {
    try {
        const res = await axios.get('/management/user/total-users', {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        return res.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        };
    }
};