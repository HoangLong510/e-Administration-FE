import axios from "~/axios"

//List
export const GetAllScheduleAPI = async () => {
    try {
        const res = await axios.get('/schedule/getall', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        }
    }
}

// Create Schedule API
export const CreateScheduleAPI = async (scheduleData) => {
    try {
        const { EndTime, ...filteredScheduleData } = scheduleData;

        const res = await axios.post('/schedule/create', filteredScheduleData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.data; 
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                errors: error.response.data.errors || {}, 
                message: error.response.data.title || "Validation failed",
            };
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        };
    }
};
//Update
export const UpdateScheduleAPI = async (UpdateData) => {
    try{
        const res = await axios.put('/schedule/update/${id}', UpdateData,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
        return {
            success: false,
            message: "Server is having problems, please try again later"
        }
    }
}
//Delete
export const DeleteScheduleAPI = async (id) => {
    try {
        const res = await axios.delete(`/schedule/delete/${id}`, {
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