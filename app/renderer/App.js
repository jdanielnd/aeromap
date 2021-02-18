import React from 'react';
import { useEffect, useState } from 'react';
import { HashRouter, Link, Route, Switch } from "react-router-dom";

import { ipcRenderer } from "electron";

import './index.scss';
import 'leaflet/dist/leaflet.css';

import Map from './components/Map'
import Settings from './components/Settings'
import AerowinxStore from './contexts/AerowinxContext';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function App(props) {

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      ipcRenderer.send('connection')
    }, 1000);
    return () => clearInterval(interval);
  });

  ipcRenderer.on('connection-reply', (event, arg) => {
    setConnected(arg)
  })

  return (
    <AerowinxStore>
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/settings">
              <Settings connected={connected} />
            </Route>
            <Route exact path="/" render={() => {
              return (
                connected ?
                <Map /> :
                <Settings />
              )
            }}/>
          </Switch>

          <nav>
            <ul>
              <li>
                <Link to="/">Map</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
            </ul>
          </nav>
        </div>
      </HashRouter>
    </AerowinxStore>
  );
}


