// Store thunks here with engine to cleanly apply changes to the engine,
// update state and then make the relevant information available.

// TODO: Move the rest of the thunks here and remove engine manipulation
// from the components. I am deferring this for later while I focus on
// other features.

import {incrementCounter, setActiveTab, setSelectedParticipant} from "./appSlice";

export const deleteFileThunk = (engine, fileId) => (dispatch, getState) => {
    const files = engine.getFiles();
    const index = files.findIndex((file) => file.uid === fileId);
    let newUid = null;
    if (index === 0 && files.length > 1) {
        newUid = files[index + 1].uid;
    } else if (index > 0) {
        newUid = files[index - 1].uid;
    }
    engine.removeFile(fileId);
    dispatch(setActiveTab(newUid));
    dispatch(incrementCounter());
};

export const addFileThunk = (engine, fileName) => (dispatch, getState) => {
    const newFile = engine.addFile(fileName, fileName, "");
    dispatch(setActiveTab(newFile.uid));
    dispatch(incrementCounter());
};

export const selectParticipantThunk = (participantName) => (dispatch) => {
    dispatch(setSelectedParticipant(participantName));
};

export const addParticipantThunk = (engine, name, description) => (dispatch, getState) => {
    const selectedBehaviorId = getState().app.selectedBehavior;
    if (!selectedBehaviorId) {
        throw new Error("No behavior selected");
    }
    const behavior = engine.getNode(selectedBehaviorId).getBehavior();
    const participantInstance = engine.createParticipant({
        name: name, description: description,
    });
    behavior.addParticipant(participantInstance);
    dispatch(setSelectedParticipant(name));
    dispatch(incrementCounter());
};

export const deleteParticipantThunk = (engine, participantId) => (dispatch, getState) => {
    const selectedBehaviorId = getState().app.selectedBehavior;
    if (!selectedBehaviorId) {
        throw new Error("No behavior selected");
    }
    const behavior = engine.getNode(selectedBehaviorId).getBehavior();
    behavior.removeParticipant(participantId);
    const p = behavior.getParticipants();
    if (p.length > 0) {
        dispatch(setSelectedParticipant(p[0].getName()));
    } else {
        dispatch(setSelectedParticipant(null));
    }
    dispatch(incrementCounter());
};
