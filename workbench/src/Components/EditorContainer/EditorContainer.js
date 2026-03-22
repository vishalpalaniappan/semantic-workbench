import React, {useContext, useLayoutEffect, useRef, useEffect} from "react";

import {Editor} from "sample-ui-component-library";
import {useDragState} from "ui-layout-manager-dev";

import ServerContext from "../../Providers/ServerContext";

import "./EditorContainer.scss";

EditorContainer.propTypes = {};

const flattenTree = (tree, level = 0) =>
    tree.flatMap((node) => [
        {...node, level},
        ...(node.children ? flattenTree(node.children, level + 1) : []),
    ]);

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function EditorContainer () {
    const {workspace} = useContext(ServerContext);
    const workspaceRef = useRef();

    const {drop} = useDragState();

    useEffect(() => {
        if (!drop?.overId) {
            return;
        }

        const activeType = drop.activeData.type;
        const overType = drop.overData.type;
        if (activeType === "EditorTab" && overType === "EditorTabGutter") {
            workspaceRef.current.moveTab(drop.activeData.node.uid, drop.overData.index);
        } else if (activeType === "FileTreeNode" && overType === "EditorTabGutter") {
            workspaceRef.current.addTab(drop.activeData.node, drop.overData.index);
        }
    }, [drop]);

    useLayoutEffect(() => {
        if (workspace && workspaceRef?.current) {
            workspaceRef.current.setTabGroupId("tab-group-1");
            flattenTree(workspace).forEach((node) => {
                if (node.type === "file") {
                    workspaceRef.current.addTab(node);
                }
            });
        }
    }, [workspace]);

    return (
        <div className="editorContainer" style={{padding: "0 3px"}}>
            <Editor ref={workspaceRef} />
        </div>
    );
}
