import axios from "~/axios";

export const getAllClasses = async ({ search = "", page = 1, pageSize = 10 } = {}) => {
  try {
    const res = await axios.get('/management/class', {
      params: {
        search,
        page,
        pageSize
      },
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


export const getClassById = async (id) => {
  try {
    const res = await axios.get(`/management/class/${id}`, {
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

export const addClass = async (newClass) => {
  try {
    const res = await axios.post('/management/class', newClass, {
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

// Xóa lớp học
export const deleteClass = async (id) => {
  try {
    const res = await axios.delete(`/management/class/${id}`, {
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

export const updateClass = async (id, updatedClass) => {
  try {
    const res = await axios.put(`/management/class/${id}`, updatedClass, {
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

export const checkClassNameExists = async (className) => {
  try {
    const res = await axios.get('/management/class/check-name', {
      params: { name: className },
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

export const getUsersByClassId = async (classId) => {
  try {
    const res = await axios.get(`/management/class/${classId}/users`, {
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



