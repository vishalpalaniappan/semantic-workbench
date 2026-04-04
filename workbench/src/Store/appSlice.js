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
            /**
             * TODO:
             * Using a counter like this typically indicates that there is a
             * better way to do this. In this case, the reason for this is,
             * when I add an invariant to a participant, the reference does
             * not change, so it doesn't react. The better way to do this would
             * be to save the invariant ids to a store when participant is
             * selected or if the invariant list has changed. This is a quick
             * fix for now but I will refactor this later to be more efficient.
             **/
            state.counter += 1;
        },
    },
});

export const {setSelectedBehavior, setSelectedParticipant, setActiveTab, setStatusMsg, setLastSaved,
    setSelectedGraph, setSelectedInvariant, incrementCounter} = appSlice.actions;

export default appSlice.reducer;
