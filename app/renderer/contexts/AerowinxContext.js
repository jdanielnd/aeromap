import React, { createContext, useReducer } from "react";
import AerowinxReducer from '../reducers/AerowinxReducer'

const initialState = {
    address: "127.0.0.1",
    position: { lat: 10, lng: 10, hdg: 0 },
    alwaysOnTop: true
};

const AerowinxStore = ({children}) => {
    const [state, dispatch] = useReducer(AerowinxReducer, initialState);
    return (
        <AerowinxContext.Provider value={[state, dispatch]}>
            {children}
        </AerowinxContext.Provider>
    )
};

export const AerowinxContext = createContext(initialState);
export default AerowinxStore;
