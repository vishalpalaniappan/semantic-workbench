import {saveInvariantPropValues} from "../helpers/helper";
import {setActiveTab} from "./appSlice";
import {setSelectedGraph} from "./appSlice";
import {incrementCounter} from "./appSlice";
import {setSelectedParticipant} from "./appSlice";
import {setSelectedBehavior} from "./appSlice";

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

/**
 * Adds an invariant to the selected participant with the given information.
 * @param {String} name Name of the invariant.
 * @param {String} description Description of the invariant.
 * @param {Object} invariantType Type of the invariant (e.g. minLength etc).
 * @param {Object} invariantTypeProps Properties for the invariant type.
 * @return {Function} Thunk function.
 */
// eslint-disable-next-line max-len
export const addInvariantThunk = ({name, description, invariantType, invariantTypeProps}) => (dispatch, getState, {engine}) => {
    if (name && name.trim() === "") {
        throw new Error("Invariant name must not be empty.");
    }
    const participantId = getState().app.selectedParticipant;
    const selectedBehaviorId = getState().app.selectedBehavior;
    if (!selectedBehaviorId) {
        throw new Error("No behavior selected");
    }
    const behavior = engine.getNode(selectedBehaviorId).getBehavior();
    const participant = behavior.getParticipant(participantId);
    if (!participant) {
        throw new Error("No participant selected");
    }

    // Create invariant and assign invariant type
    const invariant = engine.createInvariant({name: name, description: description});
    invariant.invariantType = invariantType;

    // Save invariant property values to the invariant type
    saveInvariantPropValues(invariant, invariantTypeProps);

    participant.addInvariant(invariant);
    dispatch(setSelectedParticipant(participantId));
    dispatch(incrementCounter());
};

/**
 * Deletes an invariant given its ID.
 * @param {String} invariantId - The ID of the invariant to delete.
 * @return {Function} Thunk function.
 */
export const deleteInvariantThunk = (invariantId) => (dispatch, getState, {engine}) => {
    const participantId = getState().app.selectedParticipant;
    const selectedBehaviorId = getState().app.selectedBehavior;
    if (!selectedBehaviorId) {
        throw new Error("No behavior selected");
    }
    const behavior = engine.getNode(selectedBehaviorId).getBehavior();
    const participant = behavior.getParticipant(participantId);
    if (!participant) {
        throw new Error("No participant selected");
    }
    participant.removeInvariant(invariantId);
    dispatch(setSelectedParticipant(participantId));
    dispatch(incrementCounter());
};

/**
 * Graph thunk for adding a graph to the engine and updating the active tab.
 * @param {String} graphName Graph name.
 * @return {Function} Thunk function.
 */
export const addGraphThunk = (graphName) => (dispatch, getState, {engine}) => {
    engine.createGraph(graphName);
    dispatch(setSelectedGraph(engine.graphs.getActiveGraph().name));
    dispatch(incrementCounter());
};

/**
 * Graph thunk for deleting a graph from the engine and updating the active tab.
 * @param {String} graphName Graph name.
 * @return {Function} Thunk function.
 */
export const deleteGraphThunk = (graphName) => (dispatch, getState, {engine}) => {
    engine.removeGraph(graphName);
    dispatch(setSelectedGraph(engine.graphs.getActiveGraph().name));
    dispatch(incrementCounter());
};

/**
 * Selects a behavior given its ID and updates the selected participant to 
 * the first participant of the behavior if it exists.
 * @param {String} behaviorId String ID of the behavior to select.
 * @return {Function} Thunk function.
 */
export const selectBehaviorThunk = (behaviorId) => (dispatch, getState, {engine}) => {
    if (!behaviorId) {
        dispatch(setSelectedBehavior(null));
        return;
    }
    const behavior = engine.getNode(behaviorId).getBehavior();
    dispatch(setSelectedBehavior(behaviorId));
    const participants = behavior.getParticipants();
    if (participants.length > 0) {
        dispatch(setSelectedParticipant(participants[0].getName()));
    } else {
        dispatch(setSelectedParticipant(null));
    }
};
