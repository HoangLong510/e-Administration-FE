import axios from "~/axios";

export const getProfileApi = async () => {
    try {
        const res = await axios.get('/auth/fetch-user', {
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

export const updateProfileApi = async (updatedUserData) => {
    try {
        const formData = new FormData();

        Object.keys(updatedUserData).forEach(key => {
            formData.append(key, updatedUserData[key]);
        });

        const res = await axios.put('/auth/update-user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

  export const changePasswordApi = async (oldPassword, newPassword, confirmPassword) => {
    try {
        const res = await axios.post('/auth/change-password', {
            oldPassword,
            newPassword,
            confirmPassword
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
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




