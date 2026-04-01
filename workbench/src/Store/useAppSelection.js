import {useMemo} from "react";

import {useSelector} from "react-redux";

import {useDalEngine} from "../Providers/GlobalProviders";
import {
    selectSelectedBehaviorId,
    selectSelectedGraphId,
    selectSelectedParticipantId
} from "./appSelectors";

export const useSelectedGraph = () => {
    const {engine} = useDalEngine();
    const selectedGraphId = useSelector(selectSelectedGraphId);

    return useMemo(() => {
        if (!selectedGraphId) return null;
        engine.selectGraph(selectedGraphId);
        return engine.graph;
    }, [engine, selectedGraphId]);
};

export const useGraphs = () => {
    const {engine} = useDalEngine();

    return useMemo(() => {
        return engine.graphs.getGraphNames();
    }, [engine]);
};

export const useParticipants = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);

    return useMemo(() => {
        if (!selectedBehaviorId) return [];
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        return behavior.getParticipants();
    }, [engine, selectedBehaviorId]);
};

export const useInvariants = () => {
    const {engine} = useDalEngine();
    const selectedBehaviorId = useSelector(selectSelectedBehaviorId);
    const selectedParticipantId = useSelector(selectSelectedParticipantId);

    return useMemo(() => {
        if (!selectedBehaviorId || !selectedParticipantId) return [];
        const behavior = engine.getNode(selectedBehaviorId).getBehavior();
        const participant = behavior.getParticipant(selectedParticipantId);
        return participant ? participant.getInvariants() : [];
    }, [engine, selectedBehaviorId, selectedParticipantId]);
};
