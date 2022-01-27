import { createSlice } from '@reduxjs/toolkit'

const openSearchSlice = createSlice({
    name: 'openSearch',
    initialState: {
        anchorEl: null,
        onSearch: false,
        playlistResults: []
    },
    reducers: {
        setAnchorEl: (state, action) => {
            state.anchorEl = action.payload;
        },
        handleCloseSearch: (state) => {
            state.anchorEl = null;
        },
        handleStartSearch: (state) => {
            state.onSearch = true
        },
        handleStopSearch: (state) => {
            state.onSearch = false;
        },
        setPlaylistResult: (state, action) => {
            state.playlistResults = action.payload;
        }
    }
});

export const { setAnchorEl, handleCloseSearch, handleStartSearch, handleStopSearch, setPlaylistResult } = openSearchSlice.actions;
export const selectAnchorEl = (state) => state.openSearch.anchorEl;
export const selectSearchStatus = (state) => state.openSearch.onSearch;
export const selectPlaylistResults = (state) => state.openSearch.playlistResults;

export default openSearchSlice.reducer;