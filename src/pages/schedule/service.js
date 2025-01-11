import axios from "~/axios";

const apiRequest = async (method, url, data = null) => {
    try {
        const config = {
            method,
            url,
            data
        };
        const res = await axios(config);
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

// List Schedules
export const GetAllScheduleAPI = async (includeAll = false) => {
    const queryParams = includeAll ? '?includeAll=true' : '';
    return await apiRequest('get', `/schedule${queryParams}`);
  };

// Get Schedule by ID
export const GetScheduleByIdAPI = async (id) => {
    return await apiRequest('get', `/schedule/schedule/${id}`);
};



// Create Schedule API
export const CreateScheduleAPI = async (scheduleData) => {
    const { EndTime, ...filteredScheduleData } = scheduleData;
    return await apiRequest('post', '/schedule', filteredScheduleData);
};

// Delete Schedule API
export const DeleteScheduleAPI = async (id) => {
    try {
      const response = await apiRequest('delete', `/schedule/${id}`);
      
      if (response && response.success) {
        return {
          success: true,
          message: response.message || 'Schedule deleted successfully!'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to delete schedule: Unknown error'
        };
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      return {
        success: false,
        message: "An error occurred while deleting the schedule. Please check the console for details."
      };
    }
  };



export const ExportSchedulesToExcelAPI = async (userId) => {
  try {
      const response = await axios({
          method: 'get',
          url: `/schedule/export/${userId}`,
          responseType: 'blob' 
      });


      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Schedules_${userId}.xlsx`); 
      document.body.appendChild(link);
      link.click();
  } catch (error) {
      console.error("Error exporting schedules:", error);
      return {
          success: false,
          message: "Error exporting the schedules. Please try again later."
      };
  }
};
export const GetAllClassAPI = async () => {
  return await apiRequest('get', `/schedule/allclass`);
};
export const GetAllLabAPI = async () => {
  return await apiRequest('get', `/schedule/alllab`);
};

// Get Schedules by Lab
export const GetSchedulesByLabAPI = async (lab) => {
  return await apiRequest('get', `/schedule/lab/${lab}`);
};
// Get Schedule by FullName
export const GetScheduleByFullNameAPI = async (fullName) => {
  return await apiRequest('get', `/schedule/fullname/${fullName}`);
};
//Get Schedule by Lab and FullName
export const GetScheduleByConditionAPI = async (Name, Lab) => {
  let condition = '';
  if (Name) {
    condition += `?Name=${encodeURIComponent(Name)}`;
  }
  if (Lab) {
    condition += condition ? `&Lab=${encodeURIComponent(Lab)}` : `?Lab=${encodeURIComponent(Lab)}`;
  }

  return await apiRequest('get', `/schedule/GetScheduleByCondition${condition}`);
};

