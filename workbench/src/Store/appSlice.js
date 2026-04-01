import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        selectedBehavior: null,
        selectedParticipant: null,
        selectedGraph: null,
        selectedInvariant: null,
        counter: 0,
    },
    reducers: {
        setSelectedBehavior(state, action) {
            // console.log("Setting selected behavior to:", action.payload);
            state.selectedBehavior = action.payload;
            state.selectedParticipant = null;
        },
        setSelectedParticipant(state, action) {
            // console.log("Setting selected participant to:", action.payload);
            state.selectedParticipant = action.payload;
        },
        setSelectedGraph(state, action) {
            // console.log("Setting selected graph to:", action.payload);
            state.selectedGraph = action.payload;
        },
        setSelectedInvariant(state, action) {
            // console.log("Setting selected invariant to:", action.payload);
            state.selectedInvariant = action.payload;
        },
        incrementCounter (state) {
            state.counter += 1;
        },
    },
});

export const {setSelectedBehavior, setSelectedParticipant,
    setSelectedGraph, setSelectedInvariant, incrementCounter} = appSlice.actions;

export default appSlice.reducer;
