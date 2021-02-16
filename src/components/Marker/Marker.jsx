import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useEffect, useState } from 'react';

import L from 'leaflet';
import { Marker as LeafletMarker, Popup, useMap } from 'react-leaflet'
import { ipcRenderer } from "electron";

import Heading from '../Heading';

export default function Marker(props) {
  const [position, setPosition] = useState({ lat: 10, lng: 10, hdg: 0 })
  const map = useMap();

  map.setView(position, map.getZoom())

  useEffect(() => {
    const interval = setInterval(() => {
      ipcRenderer.send('position')
    }, 250);
    return () => clearInterval(interval);
  }, []);
  
  ipcRenderer.once('position-reply', (event, arg) => {
    setPosition(arg)
    map.setView(arg, map.getZoom())
  })

  return (
    <LeafletMarker
      position={position}
      icon={
        L.divIcon({
          className: "custom icon",
          html: ReactDOMServer.renderToString(
            <Heading heading={position.hdg} /> 
          ),
          iconSize: new L.Point(45, 45),
        })
      }
    >
      <Popup>You are here</Popup>
    </LeafletMarker>
  )
}
