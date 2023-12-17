import { MapContainer, TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet';
import Marker from './Marker';

function ChangeView({ center, zoom }: { center: LatLngExpression, zoom: number}): null {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Map({ position, heading }: { position: [number, number], heading: number}) {

  return (
    <div className='map-container'>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <ChangeView center={position} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} heading={heading} />
      </MapContainer>
    </div>
  )
}