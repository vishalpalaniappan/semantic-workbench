import React, {useContext, useEffect, useState} from "react";

import {
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import PropTypes from "prop-types";

import "@xyflow/react/dist/style.css";
import "./FlowDiagram.scss";

Flow.propTypes = {
    tree: PropTypes.object,
};

/**
 * Flow component which renders the dependency graph.
 * @param {Object} tree
 * @return {JSX.Element}
 */
export function Flow ({tree}) {
    const {fitView} = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tree) {
            fitView();
        }
    }, [tree, fitView]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesDraggable={false}
            colorMode={"dark"}
            fitView
        >
            <Controls />
        </ReactFlow>
    );
};

/**
 *
 * @return {JSX.Element}
 */
export function FlowDiagram () {
    const [tree] = useState();

    return (
        <ReactFlowProvider>
            <Flow tree={tree} />
        </ReactFlowProvider>
    );
};
