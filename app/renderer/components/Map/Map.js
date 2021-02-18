import React from 'react';
import { useContext } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'

import Marker from '../Marker'
import { AerowinxContext } from '../../contexts/AerowinxContext'

import 'leaflet/dist/leaflet.css';

export default function Map(props) {

  const [state, dispatch] = useContext(AerowinxContext);

  return (
    <MapContainer
      center={state.position}
      zoom={13}
      scrollWheelZoom={false}>
      
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker />
    </MapContainer>
  );
}
