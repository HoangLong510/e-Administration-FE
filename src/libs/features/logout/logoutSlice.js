import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false
}

export const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {
        openLogout: (state) => {
            state.value = true
        },
        closeLogout: (state) => {
            state.value = false
        }
    },
})

export const { openLogout, closeLogout } = logoutSlice.actions

export default logoutSlice.reducer