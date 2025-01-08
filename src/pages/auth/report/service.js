import axios from "~/axios";

export const getUserApi = async () => {
  try {
    const res = await axios.get('/auth/fetch-user', {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

export const createReport = async (newReport, images = []) => {
  try {
    const formData = new FormData();
    Object.entries(newReport).forEach(([key, value]) => value && formData.append(key, value));
    images.forEach(image => formData.append("images", image));

    const res = await axios.post("/report", formData);
    return res.data;
  } catch (error) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

export const getReportsByUser = async ({ senderId, category, status, page = 1, pageSize = 10 }) => {
  try {
    const res = await axios.get('/report/list', {
      headers: { 'Content-Type': 'application/json' },
      params: {
        senderId,
        category: category || null,
        status: status || null,
        page,
        pageSize,
      }
    });
    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};


export const getAllReports = async ({ category, status, page = 1, pageSize = 10 }) => {
  try {
    const res = await axios.get('/report/all', {
      headers: { 'Content-Type': 'application/json' },
      params: {
        category: category || null,
        status: status || null,
        page,
        pageSize,
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

export const updateReportStatus = async (reportId, status) => {
  try {
    const response = await axios.put(`/report/${reportId}/status`, status, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating report status:", error.response || error.message);
    throw error;
  }
};

