import React, {useCallback, useEffect, useRef} from "react";

import {Floppy, PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {FileBrowser} from "sample-ui-component-library";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setActiveTab, setStatusMsg} from "../../Store/appSlice";
import {deleteFileThunk} from "../../Store/appThunk";
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

    useEffect(() => {
        if (files) {
            fileBrowserRef.current.addFileTree(files);
            if (activeTab) {
                // TODO: Update component API to use uid for selection.
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
                dispatch(deleteFileThunk(activeTab));
            } catch (err) {
                console.error(err);
            }
        }
    }, [activeTab, dispatch]);

    const saveFiles = useCallback(() => {
        if (engine) {
            engine.save();
            dispatch(setStatusMsg("Saving design..."));
        }
    }, [engine, dispatch]);

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
