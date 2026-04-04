import {useMemo} from "react";

import {useSelector} from "react-redux";

import {useDalEngine} from "../Providers/GlobalProviders";
import {
    selectActiveTab,
    selectCounter,
    selectSelectedBehaviorId,
    selectSelectedGraphId,
    selectSelectedInvariantId,
    selectSelectedParticipantId,
    selectStatusMsg
} from "./appSelectors";

/**
 * Returns the selected graph from the engine.
 * @return {Object}
 */
export const useSelectedGraph = () => {
    const {engine} = useDalEngine();
    const selectedGraphId = useSelector(selectSelectedGraphId);
    const counter = useSelector(selectCounter);

    return useMemo(() => {
        if (!selectedGraphId) return null;
        engine.selectGraph(selectedGraphId);
        return engine.graph;
    }, [engine, selectedGraphId, counter]);
};

/**
 * Returns the selected behavior from the engine.
 * @return {Object}
 */
export const useSelectedBehavior = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);

    return useMemo(() => {
        if (!selectedBehaviorId) return null;
        return engine.getNode(selectedBehaviorId).getBehavior();
    }, [engine, selectedBehaviorId]);
};

/**
 * Returns the selected participant from the engine (given a behavior).
 * @return {Object}
 */
export const useSelectedParticipant = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);
    const selectedParticipantId = useSelector(selectSelectedParticipantId);

    return useMemo(() => {
        if (!selectedBehaviorId || !selectedParticipantId) return null;
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        return behavior.getParticipant(selectedParticipantId);
    }, [engine, selectedBehaviorId, selectedParticipantId]);
};

/**
 * Returns the selected invariant from engine (given a behavior and participant)
 * @return {Object}
 */
export const useSelectedInvariant = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);
    const selectedParticipantId = useSelector(selectSelectedParticipantId);
    const selectedInvariantId = useSelector(selectSelectedInvariantId);

    return useMemo(() => {
        if (!selectedBehaviorId || !selectedParticipantId || !selectedInvariantId) return null;
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        const participant = behavior.getParticipant(selectedParticipantId);
        return participant.getInvariant(selectedInvariantId);
    }, [engine, selectedBehaviorId, selectedParticipantId, selectedInvariantId]);
};

/**
 * Returns a list of graphs from the engine.
 * @return {Object}
 */
export const useGraphs = () => {
    const {engine} = useDalEngine();
    const graphId = useSelector(selectSelectedGraphId);

    return useMemo(() => {
        return engine.graphs.getGraphNames();
    }, [engine, graphId]);
};

/**
 * Returns a list of participants from the selected behavior.
 * @return {Object}
 */
export const useParticipants = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);

    return useMemo(() => {
        if (!selectedBehaviorId) return [];
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        return behavior.getParticipants();
    }, [engine, selectedBehaviorId]);
};

/**
 * Returns a list of invariants from the selected participant.
 * @return {Object}
 */
export const useInvariants = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);
    const selectedParticipantId = useSelector(selectSelectedParticipantId);
    const counter = useSelector(selectCounter);

    return useMemo(() => {
        if (!selectedBehaviorId || !selectedParticipantId) return [];
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        const participant = behavior.getParticipant(selectedParticipantId);
        return participant ? participant.getInvariants() : [];
    }, [engine, selectedBehaviorId, selectedParticipantId, counter]);
};

/**
 * Returns a list of invariant types from the engine.
 * @return {Object}
 */
export const useInvariantTypes = () => {
    const {engine} = useDalEngine();

    return useMemo(() => {
        if (!engine) return [];
        return engine.invariant_types;
    }, [engine]);
};

/**
 * Returns a list of engine files.
 * @return {Object}
 */
export const useEngineFiles = () => {
    const {engine} = useDalEngine();
    const counter = useSelector(selectCounter);

    return useMemo(() => {
        if (!engine) return null;
        return [...engine.getFiles()];
    }, [engine, counter]);
};

/**
 * Returns the currently active tab.
 * @return {Object}
 */
export const useActiveTab = () => {
    const activeTab = useSelector(selectActiveTab);

    return useMemo(() => {
        return activeTab;
    }, [activeTab]);
};

/**
 * Returns the currently active tab.
 * @return {Object}
 */
export const useStatusMsg = () => {
    const statusMsg = useSelector(selectStatusMsg);

    return useMemo(() => {
        return statusMsg;
    }, [statusMsg]);
};
