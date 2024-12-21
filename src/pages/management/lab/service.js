import axios from "~/axios";

const API_URL = "/management/lab"; // Định nghĩa đường dẫn API chung

// Hàm xử lý lỗi chung
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data;
  }
  return {
    success: false,
    message: "Server is having problems, please try again later",
  };
};

// Lấy tất cả labs
export const getAllLabs = async (searchQuery, statusFilter) => { // Thêm tham số
  try {
    // Gửi tham số searchQuery và statusFilter trong request
    const res = await axios.get(API_URL, {
      params: { searchQuery, statusFilter }, 
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy lab theo ID
export const getLabById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Tạo lab mới
export const createLab = async (labData) => {
  try {
    const res = await axios.post(API_URL, labData); // Không cần headers
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Cập nhật lab
export const updateLab = async (id, labData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, labData); // Không cần headers
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Xóa lab
export const deleteLab = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};