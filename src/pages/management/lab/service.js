import axios from "~/axios";

const API_URL = "/management/lab"; // Định nghĩa đường dẫn API chung

const handleApiError = (error) => {
    if (error.response) {
        return error.response.data;
    }
    return {
        success: false,
        message: "Server is having problems, please try again later",
    };
};

export const fetchLabsApi = async (data) => {
    try {
        const res = await axios.get(API_URL, {
            params: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const getLabByIdApi = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const createLabApi = async (data) => {
    try {
        const res = await axios.post(API_URL, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const disableLabApi = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/disable-lab/${id}`,  {
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

export const updateLabApi = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
};
