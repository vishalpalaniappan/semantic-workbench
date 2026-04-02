import React, {useContext, useEffect, useRef} from "react";

import {Editor} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useWorkspace} from "../../Providers/GlobalProviders";
import ServerContext from "../../Providers/ServerContext";
import {flattenTree} from "./helper";

import { useAppMode } from "../../Store/useAppSelection";

import "./EditorContainer.scss";

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function EditorContainer () {
    const {connectionStatus} = useContext(ServerContext);
    const {workspace, mapping} = useWorkspace();
    const editorRef = useRef(null);
    const parentIdRef = useRef(null);
    const mode = useAppMode();

    useLayoutEventSubscription("file:selected", (event) => {
        editorRef.current.addTab(event.payload);
    });

    useLayoutEventSubscription("drag:drop", (event) => {
        const drop = event.payload;
        if (!drop?.overId) {
            return;
        }

        if (!drop.activeData?.node || !drop.overData) {
            return;
        }

        const activeType = drop.activeData.type;
        const overType = drop.overData.type;
        const activeParent = drop.activeData.parentId;
        const overParent = drop.overData.parentId;

        // Only drop files, not folders.
        if (drop.activeData.node.type !== "file") {
            return;
        }

        if (activeType === "EditorTab" && overType === "EditorTabGutter") {
            if (activeParent === overParent) {
                // Moving within same editor
                if (overParent === parentIdRef.current) {
                    editorRef.current.moveTab(drop.activeData.node.uid, drop.overData.index);
                }
            } else {
                // Moving between editors, need to remove the tab that was moved
                if (overParent === parentIdRef.current) {
                    editorRef.current.addTab(drop.activeData.node, drop.overData.index);
                } else if (activeParent === parentIdRef.current) {
                    editorRef.current.closeTab(drop.activeData.node.uid);
                }
            }
        } else if (activeType === "FileTreeNode" && overType === "EditorTabGutter"
            && overParent === parentIdRef.current) {
            // Moving from fileTree to editor
            editorRef.current.addTab(drop.activeData.node, drop.overData.index);
        }
    });

    useEffect(() => {
        if (!workspace) return;
        parentIdRef.current = crypto.randomUUID();
        editorRef.current.setTabGroupId(parentIdRef.current);

        // This is only for demo purposes, I am randomly loading 2 files.
        const files = flattenTree(workspace).filter((node) => node.type === "file");
        for (let i = 0; i < 4; i++) {
            editorRef.current.addTab(files[Math.floor(Math.random() * 2) + 1]);
        }
    }, [workspace, connectionStatus]);

    useEffect(() => {
        if (mode === 1) {
            editorRef.current.setMode(1);
        } else if (mode === 2) {
            editorRef.current.setMode(2);
        }
    }, [mode, editorRef]);

    useEffect(() => {
        if (!mapping || mapping.size === 0) return;

        for (const [filePath, map] of mapping.entries()) {
            const pathSplit = filePath.split("/");
            const fileName = pathSplit[pathSplit.length - 1];
            editorRef.current.setMapping(fileName, map);
        }
    }, [mapping, editorRef]);

    return (
        <Editor ref={editorRef} />
    );
}
