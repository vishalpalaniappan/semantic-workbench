import {configureStore} from "@reduxjs/toolkit";
import {DALEngine} from "dal-engine-core-js-lib-dev";

import appReducer from "./appSlice";

const engine = new DALEngine({
    name: "default",
    description: "Default engine",
});

export const store = configureStore({
    reducer: {
        app: appReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: {engine},
            },
        }),
});
