import React, {createContext, useContext, useMemo} from "react";

import {DALEngine} from "dal-engine-core-js-lib-dev";
import PropTypes from "prop-types";

const DalEngineContext = createContext(null);

/**
 * Provider for the DAL engine.
 * @return {JSX}
 */
export function DalEngineProvider ({children}) {
    const engine = useMemo(() => new DALEngine({}), []);

    return (
        <DalEngineContext.Provider value={engine}>
            {children}
        </DalEngineContext.Provider>
    );
}

DalEngineProvider.propTypes = {
    children: PropTypes.node,
};

export const useDalEngine = function () {
    const context = useContext(DalEngineContext);
    if (!context) {
        throw new Error("useLayoutController must be used within a DalEngineProvider");
    }
    return context;
};
