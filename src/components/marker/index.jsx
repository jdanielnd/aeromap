import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useEffect, useState } from 'react';

import L from 'leaflet';
import { Popup, useMap } from 'react-leaflet'
import { Marker as LeafletMarker } from 'react-leaflet';

import { ipcRenderer } from "electron";

import Heading from '../heading/index.jsx';

function Marker(props) {
  const [position, setPosition] = useState({ lat: 10, lng: 10, hdg: 0 })
  const map = useMap();

  useEffect(() => {
    const interval = setInterval(() => {
      ipcRenderer.send('position', 'ping')
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  ipcRenderer.once('position-reply', (event, arg) => {
    console.log(arg) // prints "pong"
    setPosition(arg)
    map.setView(arg, map.getZoom())
  })

  return position === null ? null : (
    <div>
      <LeafletMarker position={position} icon={L.divIcon({
        className: "custom icon",
        html: ReactDOMServer.renderToString( <Heading heading={position.hdg} /> ),
        iconSize: new L.Point(45, 45),
      })}>
        <Popup>You are here</Popup>
      </LeafletMarker>
    </div>
  )
}

export default Marker;
