import React, {useContext, useEffect, useState} from "react";

import {FileBrowser} from "sample-ui-component-library";

import Tree1 from "../../Tree1.json";

import "./DesignMetadata.scss";

DesignMetadata.propTypes = {
};

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function DesignMetadata () {
    return (
        <div style={{padding: "0 3px"}}>
            <FileBrowser tree={Tree1.tree}/>
        </div>
    );
}
