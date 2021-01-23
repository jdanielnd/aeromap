import { hot } from 'react-hot-loader';
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react';
import { ipcRenderer } from "electron";

import { iconCircle } from './Icon';

import 'leaflet/dist/leaflet.css';

const App: React.FC = () => { 

  function LocationMarker() {
    const [position, setPosition] = useState({ lat: 10, lng: 10 })
    const map = useMap();

    useEffect(() => {
      const interval = setInterval(() => {
        ipcRenderer.send('position', 'ping')
      }, 500);
      return () => clearInterval(interval);
    }, []);
    
    ipcRenderer.once('position-reply', (event: any, arg: any) => {
      console.log(arg) // prints "pong"
      setPosition(arg)
      map.setView(arg, map.getZoom())
    })

    return position === null ? null : (
      <Marker position={position} icon={iconCircle}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  )
};

export default hot(module)(App);
