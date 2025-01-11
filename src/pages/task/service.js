import axios from "~/axios"

export const getUserForTaskAssigneesApi = async () => {
    try {
        const res = await axios.get('/management/user/get-user-for-task-assignees', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        return {
            success: false,
            data: []
        }
    }
}

export const createTaskApi = async (data) => {
    try {
        const res = await axios.post('/task/create', data, {
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

export const getTasksApi = async (data) => {
    try {
        const res = await axios.post('/task/get-tasks', data, {
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