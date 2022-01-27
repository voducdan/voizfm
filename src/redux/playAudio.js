import { createSlice } from '@reduxjs/toolkit'

const playAudioSlice = createSlice({
    name: 'playAudio',
    initialState: {
        playing: false
    },
    reducers: {
        togglePlayAudio: (state) => {
            state.playing = !state.playing
        }
    }
});

export const { togglePlayAudio } = playAudioSlice.actions;
export const selectPlayAudio = (state) => state.playAudio.playing;

export default playAudioSlice.reducer;