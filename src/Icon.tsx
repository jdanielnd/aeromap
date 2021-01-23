import L from 'leaflet';
import circle from "./assets/images/circle.svg"

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
