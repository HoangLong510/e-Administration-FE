import axios from "~/axios";

export const fetchDevicesApi = async (data) => {
    try {
        const res = await axios.post('/management/Device/get-devices', data, {
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
export const getDeviceByIdApi = async (id) => {
    try {
        const res = await axios.get(`/management/Device/get-device/${id}`);
        
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

export const createDeviceApi = async (data) => {
    try{

        const res = await axios.post('/management/Device/create-device', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
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


export const disableDeviceApi = async (id) => {
    try {
        const res = await axios.get(`/management/Device/disable-device/${id}`, {
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

export const updateDeviceApi = async (id, data) => {
    try {
        const res = await axios.put(`/management/Device/update-device/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
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
