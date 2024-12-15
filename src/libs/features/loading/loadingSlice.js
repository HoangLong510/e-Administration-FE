import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.value = true
        },
        clearLoading: (state) => {
            state.value = false
        }
    },
})

export const { setLoading, clearLoading } = loadingSlice.actions

export default loadingSlice.reducer