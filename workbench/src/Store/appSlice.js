import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        selectedBehavior: null,
        selectedParticipant: null,
        selectedGraph: null,
        selectedInvariant: null,
        statusMsg: null,
        tabs: null,
        activeTab: null,
        lastSaved: null,
        counter: 0,
    },
    reducers: {
        setSelectedBehavior(state, action) {
            // console.log("Setting selected behavior to:", action.payload);
            state.selectedParticipant = null;
            state.selectedInvariant = null;
            state.selectedBehavior = action.payload;
        },
        setSelectedParticipant(state, action) {
            // console.log("Setting selected participant to:", action.payload);
            state.selectedInvariant = null;
            state.selectedParticipant = action.payload;
        },
        setSelectedGraph(state, action) {
            // console.log("Setting selected graph to:", action.payload);
            state.selectedBehavior = null;
            state.selectedParticipant = null;
            state.selectedInvariant = null;
            state.selectedGraph = action.payload;
        },
        setSelectedInvariant (state, action) {
            // console.log("Setting selected invariant to:", action.payload);
            state.selectedInvariant = action.payload;
        },
        setActiveTab (state, action) {
            // console.log("Setting active tab to:", action.payload);
            state.activeTab = action.payload;
        },
        setStatusMsg (state, action) {
            state.statusMsg = action.payload;
        },
        setLastSaved (state, action) {
            state.lastSaved = action.payload;
        },
        incrementCounter (state) {
            state.counter = (state.counter + 1) % 100000;
        },
    },
});

export const {setSelectedBehavior, setSelectedParticipant, setActiveTab, setStatusMsg, setLastSaved,
    setSelectedGraph, setSelectedInvariant, incrementCounter} = appSlice.actions;

export default appSlice.reducer;
