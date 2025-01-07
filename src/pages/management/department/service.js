import axios from "~/axios";

const API_URL = "/management/departments"; // Định nghĩa đường dẫn API chung

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

// Lấy tất cả departments
export const getAllDepartments = async (searchQuery, sortBy) => {
  try {
    const res = await axios.get(API_URL, {
      params: { searchQuery, sortBy },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy department theo ID
export const getDepartmentById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Tạo department mới
export const createDepartment = async (departmentData) => {
  try {
    const res = await axios.post(API_URL, departmentData);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Cập nhật department
export const updateDepartment = async (id, departmentData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, departmentData);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Xóa department
export const deleteDepartment = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};