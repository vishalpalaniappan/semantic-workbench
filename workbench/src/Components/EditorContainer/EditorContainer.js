import React, {useContext, useEffect, useRef} from "react";

import {Editor} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useWorkspace} from "../../Providers/GlobalProviders";
import {useDalEngine} from "../../Providers/GlobalProviders";
import ServerContext from "../../Providers/ServerContext";
import {useEngineFiles} from "../../Store/useAppSelection";
import {useActiveTab} from "../../Store/useAppSelection";

import "./EditorContainer.scss";

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function EditorContainer () {
    const {connectionStatus} = useContext(ServerContext);
    const {workspace} = useWorkspace();
    const {engine} = useDalEngine();
    const editorRef = useRef(null);
    const parentIdRef = useRef(null);
    const files = useEngineFiles();

    const activeTab = useActiveTab();

    // Close tabs of files that were deleted, and update saved content
    useEffect(() => {
        if (files) {
            const _tabs = editorRef.current.getTabs();
            for (let i = 0; i < _tabs.length; i++) {
                const _tab = _tabs[i];
                if (!files.find((file) => file.uid === _tab.uid)) {
                    editorRef.current.closeTab(_tab.uid);
                }
                editorRef.current.setContent(_tab, _tab.content);
            }
        }
    }, [files]);

    useEffect(() => {
        if (activeTab && engine && editorRef.current) {
            const source = engine.getFile(activeTab);
            editorRef.current.addTab(source);
        }
    }, [activeTab, editorRef.current, engine]);

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
    }, [workspace, connectionStatus]);

    return (
        <Editor ref={editorRef} />
    );
}
