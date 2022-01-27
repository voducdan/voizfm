import { createSlice } from '@reduxjs/toolkit'

const openLoginSlice = createSlice({
    name: 'openLogin',
    initialState: {
        open: false
    },
    reducers: {
        setOpenLogin: (state, action) => {
            state.open = action.payload
        },
        handleCloseLogin: (state) => {
            state.open = false
        },
        handleOpenLogin: (state) => {
            state.open = true
        }
    }
});

export const { setOpenLogin, handleCloseLogin, handleOpenLogin } = openLoginSlice.actions;
export const selectOpenLogin = (state) => state.openLogin.open;

export default openLoginSlice.reducer;