import { Marker as LeafletMarker } from 'react-leaflet'
import L from 'leaflet'
import ReactDOMServer from 'react-dom/server'

function Heading({heading}: {heading: number}) {
  return (
    <svg height="45" width="45" viewBox={`0 0 1000 1000`}>
      <polygon points="500,150 250,750 750,750" className="triangle" transform={"rotate(" + heading + ", 500, 500)"} />
      Sorry, your browser does not support inline SVG.
    </svg>
  );
}

export default function Marker({position, heading}: {position: [number, number], heading: number}) {
  return (
    <LeafletMarker
      position={position}
      icon={
        L.divIcon({
          className: "custom icon",
          html: ReactDOMServer.renderToString(
            <Heading heading={heading} /> 
          ),
          iconSize: new L.Point(45, 45),
        })
      }
    >
    </LeafletMarker>
  )
}