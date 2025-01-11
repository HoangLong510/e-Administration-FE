import axios from "~/axios";

// Document APIs
export const createDocumentApi = async (data) => {
    try {
        const res = await axios.post('/management/Document/create-document', data, {
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

export const fetchDocumentsApi = async (data) => {
    try {
        const res = await axios.post('/management/Document/get-documents', data, {
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

export const disableDocumentApi = async (id) => {
    try {
        const res = await axios.put(`/management/Document/disable-document/${id}`, {
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

// Download Document API
export const downloadDocumentApi = async (id) => {
    try {
        const res = await axios.get(`/management/Document/download-document/${id}`, {
            responseType: 'arraybuffer', // Thiết lập kiểu phản hồi là arraybuffer
        });
        return {
            success: true,
            data: res.data,
            fileName: res.headers['content-disposition']?.split('filename=')[1]?.split(';')[0]?.replace(/"/g, '') || 'document'
        };
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
