import { useEffect } from 'react';
import { useLeafletContext } from '@react-leaflet/core'
import L from 'leaflet';

function Heading(props: any): any {
  const context = useLeafletContext()

  useEffect(() => {
    const vectorSize = 0.0005
    const indicator = [props.center.lat + vectorSize, props.center.lng]
    const center = [props.center.lat, props.center.lng]
    const square = new L.Polyline(
      [props.center, rotatePoint(indicator, center, props.angle)]
    )
    const container = context.layerContainer || context.map
    container.addLayer(square)

    return () => {
      container.removeLayer(square)
    }
  })

  function rotatePoint(point: Array<number>, center: Array<number>, degrees: number): [number, number] {
      var newx = (point[0] - center[0]) * Math.cos(degrees * Math.PI / 180) - (point[1] - center[1]) * Math.sin(degrees * Math.PI / 180) + center[0];
      var newy = (point[0] - center[0]) * Math.sin(degrees * Math.PI / 180) + (point[1] - center[1]) * Math.cos(degrees * Math.PI / 180) + center[1];
      return [newx, newy];
  }

  function rotate(array: Array<number>, angle: number) {
    function r2d(a: number) { return a * Math.PI / 180; }
    return [
        Math.cos(angle) * array[0] - Math.sin(angle) * array[1],
        Math.sin(angle) * array[0] - Math.cos(angle) * array[1],
    ];
  }

  return null
}

export default Heading

//  Reference: https://react-leaflet.js.org/docs/core-architecture
