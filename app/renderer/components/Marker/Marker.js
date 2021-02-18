import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useEffect, useContext } from 'react';
import { AerowinxContext } from '../../contexts/AerowinxContext'

import L from 'leaflet';
import { Marker as LeafletMarker, Popup, useMap } from 'react-leaflet'
import { ipcRenderer } from "electron";

import Heading from '../Heading';

export default function Marker(props) {
  const [state, dispatch] = useContext(AerowinxContext);

  const map = useMap();

  map.setView(state.position, map.getZoom())

  useEffect(() => {
    const interval = setInterval(() => {
      ipcRenderer.send('position')
    }, 250);
    return () => clearInterval(interval);
  }, []);
  
  ipcRenderer.once('position-reply', (event, arg) => {
    dispatch({type: 'SET_POSITION', payload: arg});
    map.setView(arg, map.getZoom())
  })

  return (
    <LeafletMarker
      position={state.position}
      icon={
        L.divIcon({
          className: "custom icon",
          html: ReactDOMServer.renderToString(
            <Heading heading={state.position.hdg} /> 
          ),
          iconSize: new L.Point(45, 45),
        })
      }
    >
    </LeafletMarker>
  )
}
