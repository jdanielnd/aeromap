import { hot } from 'react-hot-loader';
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const App = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
);

export default hot(module)(App);
