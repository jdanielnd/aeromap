import React from 'react';
import { useEffect, useState } from 'react';
import { ipcRenderer } from "electron";

export default function Settings(props) {

  const [address, setAddress] = useState('127.0.0.1');

  useEffect(() => {
    console.log(address)
    ipcRenderer.send('ip-address', address)
  }, [address]);

  return (
    <div className="content">
      <h2>Settings</h2>
      <div className="row">
        <strong>Status:</strong> {props.connected ? "Connected" : "Disconnected"}
      </div>
      <div className="row">
        <strong>IP address:</strong>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
    </div>
  )
}
