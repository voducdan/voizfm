import { createSlice } from '@reduxjs/toolkit'

const audioSlice = createSlice({
    name: 'audio',
    initialState: {
        data: {}
    },
    reducers: {
        setAudioData: (state, action) => {
            state.data = action.payload
        }
    }
});

export const { setAudioData } = audioSlice.actions;
export const selectAudioData = (state) => state.audio.data;

export default audioSlice.reducer;