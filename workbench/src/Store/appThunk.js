// Store thunks here with engine to cleanly apply changes to the engine,
// update state and then make the relevant information available.

// TODO: Move the rest of the thunks here and remove engine manipulation
// from the components. I am deferring this for later while I focus on
// other features.

import {incrementCounter, setActiveTab, setSelectedParticipant} from "./appSlice";

/**
 * Called to delete a file given a file ID.
 * @param {string} fileId - The ID of the file to delete.
 * @return {Function} Thunk function.
 */
export const deleteFileThunk = (fileId) => (dispatch, getState, {engine}) => {
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

/**
 * Called to add a file given a file name.
 * @param {String} fileName - The name of the file to add.
 * @return {Function} Thunk function.
 */
export const addFileThunk = (fileName) => (dispatch, getState, {engine}) => {
    const newFile = engine.addFile(fileName, fileName, "");
    dispatch(setActiveTab(newFile.uid));
    dispatch(incrementCounter());
};

/**
 * Called to select a participant given a participant name.
 * @param {String} participantName - Name of the participant.
 * @return {Function} Thunk function.
 */
export const selectParticipantThunk = (participantName) => (dispatch) => {
    dispatch(setSelectedParticipant(participantName));
};

/**
 * Called to add a participant given a name and description.
 * @param {String} name - Name of the participant.
 * @param {String} description - Description of the participant.
 * @return {Function} Thunk function.
 */
export const addParticipantThunk = (name, description) => (dispatch, getState, {engine}) => {
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

/**
 * Called to delete a participant given a participant ID.
 * @param {String} participantId - The ID of the participant to delete.
 * @return {Function} Thunk function.
 */
export const deleteParticipantThunk = (participantId) => (dispatch, getState, {engine}) => {
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
