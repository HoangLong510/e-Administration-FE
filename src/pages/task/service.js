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

export const getTaskByIdApi = async (id) => {
    try {
        const res = await axios.get(`/task/get-task-by-id/${id}`, {
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

export const changeTaskStatusApi = async (id) => {
    try {
        const res = await axios.get(`/task/change-task-status/${id}`, {
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

export const cancelTaskApi = async (id) => {
    try {
        const res = await axios.get(`/task/cancel-task/${id}`, {
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

export const editTaskApi = async (data) => {
    try {
        const res = await axios.post('/task/edit-task', data, {
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