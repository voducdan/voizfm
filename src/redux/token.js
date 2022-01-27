// Import redux toolkit
import { createSlice } from '@reduxjs/toolkit'

// import service
import * as AuthService from '../services/authentication'


const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: AuthService.getToken()
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            AuthService.saveToken(action.payload)
        },
        saveToken: () => {
            AuthService.saveToken()
        },
        removeToken: () => {
            AuthService.removeToken()
        },
    }
})

export const { setToken, saveToken, removeToken } = tokenSlice.actions
export const selectToken = (state) => state.token.token

export default tokenSlice.reducer