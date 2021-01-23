import L from 'leaflet';
import airplane from "../src/images/airplane.svg"
import circle from "../src/images/circle.svg"


const iconAero = new L.Icon({
    iconUrl: airplane,
    iconRetinaUrl: null,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 60),
});

const iconCircle = new L.Icon({
  iconUrl: circle,
  iconRetinaUrl: null,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(25, 25),
});

export { iconAero, iconCircle };
