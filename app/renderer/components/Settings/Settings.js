import React from 'react';
import { useEffect, useContext } from 'react';
import { AerowinxContext } from '../../contexts/AerowinxContext'
import { ipcRenderer } from "electron";

export default function Settings(props) {

  const [state, dispatch] = useContext(AerowinxContext);

  useEffect(() => {
    ipcRenderer.send('ip-address', state.address)
  }, [state.address]);

  useEffect(() => {
    ipcRenderer.send('always-on-top', state.alwaysOnTop)
  }, [state.alwaysOnTop]);

  return (
    <div className="content">
      <h2>Settings</h2>
      <div className="row">
        <strong>Version:</strong> { require('../../../../package.json').version }
      </div>
      <div className="row">
        <strong>Status:</strong> {props.connected ? "Connected" : "Disconnected"}
      </div>
      <div className="row">
        <strong>IP address:</strong>
        <input type="text" value={state.address} onChange={(e) => dispatch({type: 'SET_ADDRESS', payload: e.target.value})} />
      </div>
      <div className="row">
        <input type="checkbox" id="alwaysOnTop" name="alwaysOnTop"
          checked={state.alwaysOnTop} onChange={(e) => dispatch({type: 'SET_ALWAYS_ON_TOP', payload: e.target.checked})} />
        <label>Always on top</label>
      </div>
    </div>
  )
}
