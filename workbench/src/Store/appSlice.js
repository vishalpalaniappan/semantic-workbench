import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        selectedBehavior: null,
        selectedParticipant: null,
        selectedGraph: null,
    },
    reducers: {
        setSelectedBehavior(state, action) {
            state.selectedBehavior = action.payload;
        },
        setSelectedParticipant(state, action) {
            state.selectedParticipant = action.payload;
        },
        setSelectedGraph(state, action) {
            state.selectedGraph = action.payload;
        },
    },
});

export const {setSelectedBehavior, setSelectedParticipant, setSelectedGraph} = appSlice.actions;

export default appSlice.reducer;
