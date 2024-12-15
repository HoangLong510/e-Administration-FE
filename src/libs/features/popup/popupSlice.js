import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        open: false,
        data: {}
    }
}

export const popupSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setPopup: (state, action) => {
            state.value = {
                open: true,
                data: action.payload
            }
        },
        clearPopup: (state) => {
            state.value = {
                open: false,
                data: {}
            }
        }
    },
})

export const { setPopup, clearPopup } = popupSlice.actions

export default popupSlice.reducer