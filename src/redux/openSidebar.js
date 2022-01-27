import { createSlice } from '@reduxjs/toolkit'

const openSidebarSlice = createSlice({
    name: 'openSidebar',
    initialState: {
        open: true
    },
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        }
    }
});

export const { setOpen } = openSidebarSlice.actions;
export const selectOpenSidebar = state => state.openSidebar.open;

export default openSidebarSlice.reducer;