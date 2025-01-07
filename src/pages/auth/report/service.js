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

export const getReportsByUser = async ({ senderId, category }) => {
  try {
    const res = await axios.get('/report/list', {
      headers: { 'Content-Type': 'application/json' },
      params: {
        senderId,
        category: category || null,
      }
    });
    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching reports:", error); // Log detailed error
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};




export const deleteReport = async (id) => {
  try {
    const res = await axios.delete(`/report/${id}`);
    return res.data;
  } catch (error) {
    return { success: false, message: "An error occurred while deleting" };
  }
};


export const getAllReports = async ({ category }) => {  // Nhận category từ tham số
  try {
    const res = await axios.get('/report/all', {
      headers: { 'Content-Type': 'application/json' },
      params: { category }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};