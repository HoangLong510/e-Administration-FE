import axios from "~/axios";

export const getProfileApi = async () => {
    try {
        const res = await axios.get('/auth/fetch-user', {
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

export const updateProfileApi = async (updatedUserData) => {
    try {
        const res = await axios.put('/auth/update-user', updatedUserData, {
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
