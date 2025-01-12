import axios from "~/axios";

export const fetchSoftwaresApi = async (data) => {
    try {
        const res = await axios.post('/management/Software/get-softwares', data, {
            headers: {
                'Content-Type': 'application/json'
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

export const getSoftwareByIdApi = async (id) => {
    try {
        const res = await axios.get(`/management/Software/get-software/${id}`);
        
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

export const createSoftwareApi = async (data) => {
    try {
        const res = await axios.post('/management/Software/create-software', data, {
            headers: {
                'Content-Type': 'application/json'
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

export const disableSoftwareApi = async (id) => {
    try {
        const res = await axios.get(`/management/Software/disable-software/${id}`, {
            headers: {
                'Content-Type': 'application/json'
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

export const updateSoftwareApi = async (id, data) => {
    try {
        const res = await axios.put(`/management/Software/update-software/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
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
export const SendExpirationNotificationsAPI = async () => {
    try {
        const res = await axios.post(`/email/send-expiration-notifications`)
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
