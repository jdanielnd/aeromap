import { useState } from 'react';
import Map, { Marker, ViewState } from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';
import { getMapStyle } from '../lib/map-styles';
import { Heading } from './Heading';

type AeromapViewState = {
  bearing: number;
  longitude: number;
  latitude: number;
}

export default function AeroMap({ viewState, setViewState, defaultZoom }: { viewState: AeromapViewState, setViewState: Function, defaultZoom: number }) {
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
      <nav>
        <ul>
          <li>
            <button onClick={() => setMapStyle('openstreetmap')}>OpenStreetMap</button>
          </li>
          <li>
            <button onClick={() => setMapStyle('satellite')}>Satellite</button>
          </li>
        </ul>
      </nav>
      <Marker {...viewState} anchor="bottom">
        <Heading />
      </Marker>
    </Map>
  )
}