import { useState, useEffect } from 'react'

import Map from './components/Map'

export default function App() {
  const [connected, setConnected] = useState(false)
  const [viewState, setViewState] = useState({
    bearing: 0,
    longitude: 0.051536548427520756,
    latitude: 51.50527121507392,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const currectConnected = () => connected;
      if (!currectConnected) return
      const pos = await window.api.getPosition()
      setViewState({...viewState, longitude: pos.lng, latitude: pos.lat, bearing: pos.hdg})
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currectConnected = () => connected;
    const interval = setInterval(async () => {
      if (currectConnected) return
      const connection = await window.api.getConnection()
      setConnected(connection)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Map viewState={viewState} setViewState={setViewState} defaultZoom={17} />
    </>
  )
}