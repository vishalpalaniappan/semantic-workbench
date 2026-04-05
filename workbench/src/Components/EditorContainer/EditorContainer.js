import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import {useDispatch} from "react-redux";
import {Editor} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import ServerContext from "../../Providers/ServerContext";
import {setActiveTab} from "../../Store/appSlice";
import {useEngineFiles} from "../../Store/useAppSelection";
import {useActiveTab, useLastSaved} from "../../Store/useAppSelection";
import {useAppMode} from "../../Store/useAppSelection";

import "./EditorContainer.scss";

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function EditorContainer () {
    const {connectionStatus} = useContext(ServerContext);
    const {engine} = useDalEngine();
    const editorRef = useRef(null);
    const parentIdRef = useRef(null);
    const files = useEngineFiles();
    const lastSaved = useLastSaved();
    const [editorLoaded, setEditorLoaded] = useState(false);

    const activeTab = useActiveTab();
    const dispatch = useDispatch();
    const appMode = useAppMode();

    // Close tabs of files that were deleted, and update saved content
    useEffect(() => {
        if (files) {
            const _tabs = editorRef.current.getTabs();
            for (let i = 0; i < _tabs.length; i++) {
                const _tab = _tabs[i];
                if (!files.find((file) => file.uid === _tab.uid)) {
                    editorRef.current.closeTab(_tab.uid);
                }
            }
        }
    }, [files]);

    useEffect(() => {
        if (editorRef.current && editorLoaded) {
            editorRef.current.setMode(appMode);
        }
    }, [appMode, editorLoaded]);

    useEffect(() => {
        if (lastSaved && files && editorRef.current) {
            /**
             * Inside editor, the content of the tab is saved in
             * updatedContent key. When updatedContent and content keys are
             * not the same, it means the file is dirty (shows icon on tab).
             * When the file is saved onto the server, the updated content
             * is set to the content key of the file, so we need to update
             * the content of the tab to reflect that.
             */
            editorRef.current.getTabs().forEach((tab) => {
                editorRef.current.setContent(tab, tab.content);
            });
        }
    }, [lastSaved]);

    useEffect(() => {
        if (activeTab && engine && editorRef.current) {
            const activeTabFile = engine.getFile(activeTab);
            editorRef.current.addTab(activeTabFile);
        }
    }, [activeTab, editorLoaded, engine]);

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

    const onSelectTab = useCallback((tab) => {
        if (editorLoaded) {
            dispatch(setActiveTab(tab && tab.uid));
        } else {
            setEditorLoaded(true);
        }
    }, [dispatch, editorLoaded]);

    const onSelectAbstraction = useCallback((abstraction) => {
        console.log("Selected abstraction:", abstraction);
    });

    useEffect(() => {
        parentIdRef.current = crypto.randomUUID();
        editorRef.current.setTabGroupId(parentIdRef.current);
    }, [connectionStatus]);

    return (
        <Editor
            ref={editorRef}
            onSelectAbstraction={onSelectAbstraction}
            onSelectTab={onSelectTab}/>
    );
}
