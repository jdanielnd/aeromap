import L from 'leaflet';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import circle from "./assets/images/circle.svg"
import { Heading } from './Heading';

const iconCircle = new L.Icon({
  iconUrl: circle,
  iconRetinaUrl: null,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(15, 15),
});

export { iconCircle };
