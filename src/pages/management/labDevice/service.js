// service.js

import axios from "~/axios";

export const fetchLabDevicesApi = async (labId, searchValue) => {
    try {
        const res = await axios.post('/management/LabDevice/get-lab-devices', { labId, searchValue }, {
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

export const fetchAddToLabApi = async (data) => {
    try {
        const res = await axios.post('/management/LabDevice/get-add-to-lab', data, {
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

export const addDevicesToLabApi = async (data) => {
    try {
        const res = await axios.post('/management/LabDevice/add-devices-to-lab', data, {
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

export const removeDevicesFromLabApi = async (data) => {
    try {
        const res = await axios.post('/management/LabDevice/remove-devices-from-lab', data, {
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
