import React from 'react';
import { useEffect, useContext } from 'react';
import { AerowinxContext } from '../../contexts/AerowinxContext'
import { ipcRenderer } from "electron";

export default function Settings(props) {

  const [state, dispatch] = useContext(AerowinxContext);

  useEffect(() => {
    ipcRenderer.send('ip-address', state.address)
  }, [state.address]);

  return (
    <div className="content">
      <h2>Settings</h2>
      <div className="row">
        <strong>Status:</strong> {props.connected ? "Connected" : "Disconnected"}
      </div>
      <div className="row">
        <strong>IP address:</strong>
        <input type="text" value={state.address} onChange={(e) => dispatch({type: 'SET_ADDRESS', payload: e.target.value})} />
      </div>
    </div>
  )
}
