import { useState } from 'react';
import Map, { Marker, ScaleControl, NavigationControl, FullscreenControl, ViewState } from 'react-map-gl/maplibre';
import { Button } from 'flowbite-react';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MAP_STYLES, getMapStyle } from '../lib/map-styles';
import { Heading } from './Heading';
import { Settings } from './Settings';

type AeromapViewState = {
  bearing: number;
  longitude: number;
  latitude: number;
}

export default function AeroMap(
  { viewState, setViewState, defaultZoom, host, port, setHost, setPort, connecting, setConnecting, connected, connectAerowinx, disconnectAerowinx }:
  { 
    viewState: AeromapViewState,
    setViewState: Function,
    defaultZoom: number,
    host: string,
    port: number,
    setHost: Function,
    setPort: Function,
    connecting: boolean,
    setConnecting: Function,
    connected: boolean,
    connectAerowinx: Function,
    disconnectAerowinx: Function
  }
) {
  const [mapStyle, setMapStyle] = useState('openstreetmap');
  const [zoom, setZoom] = useState(defaultZoom);

  return (
    <Map
      {...viewState}
      zoom={zoom}
      onMove={evt => {
        setViewState((prevState: ViewState) => ({
          ...prevState,
          longitude: evt.viewState.longitude,
          latitude: evt.viewState.latitude,
        }))
        setZoom(evt.viewState.zoom)
      }}
      style={{ height: '100vh', width: '100vw' }}
      mapStyle={getMapStyle(mapStyle)}
    >
      <nav className="absolute top-4 left-4 flex space-x-2">
        <Button.Group>
          {MAP_STYLES.map(({ name, label }) => (
            <Button className="focus:ring-0" color="gray" onClick={() => setMapStyle(name)} key={name}>{label}</Button>
          ))}
        </Button.Group>
        <Settings
          host={host}
          port={port}
          setHost={setHost}
          setPort={setPort}
          connecting={connecting}
          setConnecting={setConnecting}
          connected={connected}
          connectAerowinx={connectAerowinx}
          disconnectAerowinx={disconnectAerowinx}
        />
      </nav>
      <NavigationControl showCompass={false} />
      <ScaleControl />
      <FullscreenControl />
      <Marker {...viewState} anchor="bottom">
        <Heading />
      </Marker>
    </Map>
  )
}