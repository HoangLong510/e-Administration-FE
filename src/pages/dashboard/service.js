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

export const fetchTotalPendingReports = async () => {
    try {
        const res = await axios.get('/report/totalreportPending', {
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

export const fetchLabsStatusSummary = async () => {
    try {
        const res = await axios.get('/management/lab/status-summary', {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (res.data.success) {
            return {
                success: true,
                data: res.data.data,
            };
        }
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

export const fetchReportsForCurrentYear = async () => {
    try {
        const currentYear = new Date().getFullYear();
        const res = await axios.get('/report/monthly', {
            params: { year: currentYear },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.data.success) {
            return {
                success: true,
                data: res.data.data,
            };
        }
        return { success: false, message: res.data.message };
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

export const fetchExpiredSoftwareApi = async () => {
    try {
        const res = await axios.get('/management/Software/count-expired-softwares', {
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