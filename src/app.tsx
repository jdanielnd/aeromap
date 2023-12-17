import { useState, useEffect } from 'react'

import Map from './components/Map'

export default function App() {
  const [connected, setConnected] = useState(false)
  const [position, setPosition] = useState<[number, number]>([51, 0]) 
  const [heading, setHeading] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      const pos = await window.api.getPosition()
      setPosition([pos.lat, pos.lng])
      setHeading(pos.hdg)
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.api.setConnected(setConnected)

    const interval = setInterval(() => {
      window.api.connect()
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Map position={position} heading={heading}/>
    </>
  )
}