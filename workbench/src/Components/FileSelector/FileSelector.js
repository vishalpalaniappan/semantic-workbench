import React, {useCallback, useEffect, useRef} from "react";

import {Floppy, PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {FileBrowser} from "sample-ui-component-library";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter, setActiveTab} from "../../Store/appSlice";
import {useActiveTab, useEngineFiles} from "../../Store/useAppSelection";
import {AddFile} from "../Modals/AddFile";

import "./FileSelector.scss";

FileSelector.propTypes = {
};

/**
 * Component to select files from the workspace.
 * @return {JSX.Element}
 */
export function FileSelector () {
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();

    const files = useEngineFiles();
    const dispatch = useDispatch();
    const activeTab = useActiveTab();
    const fileBrowserRef = useRef();
    const publish = useLayoutEventPublisher();

    useEffect(() => {
        if (files) {
            fileBrowserRef.current.addFileTree(files);
            if (activeTab) {
                // TODO: This find step is because the file browser does not
                // reference file from UID, I need to update the component
                // so that it uses the UID.
                const file = files.find((file) => file.uid === activeTab);
                fileBrowserRef.current.selectNode(file);
            }
        }
    }, [files, activeTab]);

    const onSelectFile = useCallback((node) => {
        dispatch(setActiveTab(node.uid));
    }, []);

    const createFile = useCallback(() => {
        openModal({
            title: "Add File",
            render: ({close}) => {return <AddFile close={close} />;},
        });
    }, []);

    const deleteFile = useCallback(() => {
        if (activeTab) {
            try {
                const index = files.findIndex((file) => file.uid === activeTab);
                if (index === 0 && files.length > 1) {
                    dispatch(setActiveTab(files[index + 1].uid));
                } else if (index > 0) {
                    dispatch(setActiveTab(files[index - 1].uid));
                }
                engine.removeFile(activeTab);
                dispatch(incrementCounter());
            } catch (err) {
                console.error(err);
            }
        }
    }, [engine, files, fileBrowserRef, activeTab, dispatch]);

    const saveFiles = useCallback(() => {
        if (engine) {
            engine.save();
            publish({
                type: "status:set",
                payload: "Saving design...",
                source: "tool-bar",
            });
        }
    }, [engine, publish]);

    return (
        <div className="filebrowser-container">
            <div className="browser-container">
                <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile}/>
            </div>
            <div className="menu">
                <Floppy onClick={saveFiles} className="icon"/>
                <PlusSquare onClick={createFile} className="icon"/>
                <Trash onClick={deleteFile} className="icon"/>
            </div>
        </div>
    );
}
