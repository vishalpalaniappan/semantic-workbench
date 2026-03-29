import React, {useCallback, useEffect, useState} from "react";

import {
    Cursor,
    Floppy,
    PlusSquare,
    Trash
} from "react-bootstrap-icons";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";

import "./GraphMenuBar.scss";

GraphMenuBar.propTypes = {
};

/**
 * Graph Menu Bar Component
 * @return {JSX.Element}
 */
export function GraphMenuBar () {
    const {openModal} = useModalManager();

    const publish = useLayoutEventPublisher();
    const {engine} = useDalEngine();

    const [graphs, setGraphs] = useState([]);

    useEffect(() => {
        if (engine) {
            setGraphs(engine.graphs.getGraphNames());
        }
    }, [engine]);

    return (
        <div className="graphMenuBar">
            <div className="leftMenu"></div>
            <div className="rightMenu">
                <label>Selected Graph:</label>
                <select>
                    {graphs.map((graph) => (
                        <option key={graph} value={graph}>
                            {graph}
                        </option>
                    ))}
                </select>
                <PlusSquare className="icon"/>
            </div>
        </div>
    );
}
