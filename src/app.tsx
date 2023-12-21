import { useState, useEffect } from 'react'

import Map from './components/Map'

type Qs121 = {
  pitch: number,
  bank: number,
  heading: number,
  altitude: number,
  tas: number,
  lat: number,
  lon: number
};

export default function App() {
  const [host, setHost] = useState('127.0.0.1')
  const [port, setPort] = useState(10747)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [aircraftPosition, setAircraftPosition] = useState({
    bearing: 0,
    longitude: 0.051536548427520756,
    latitude: 51.50527121507392,
  });


  useEffect(() => {
    window.aerowinxApi.onConnected(() => {
      console.log('Connected to Aerowinx');
      setConnected(true);
      setConnecting(false);
    });

    window.aerowinxApi.onClosed(() => {
      console.log('Disconnected from Aerowinx');
      setConnected(false);
      setConnecting(false);
    });

    window.aerowinxApi.onError((error: string) => {
      console.info('Error connecting to Aerowinx: ', error)
      setConnected(false);
      setConnecting(false);
    });

    window.aerowinxApi.onTimeout(() => {
      console.info('Connection to Aerowinx timed out');
      setConnected(false);
      setConnecting(false);
    });

    window.aerowinxApi.onQs121((data: Qs121) => {
      if (Object.values(data).some(v => Number.isNaN(v))) return;
      setAircraftPosition({ ...aircraftPosition, longitude: data.lon, latitude: data.lat, bearing: data.heading })
    });

    connectAerowinx();

    return () => {
      window.aerowinxApi.removeListeners();
    }

  }, [])

  const connectAerowinx = () => {
    window.aerowinxApi.connect({ host, port })
    setConnecting(true);
  }

  const disconnectAerowinx = () => {
    window.aerowinxApi.close();
    setConnecting(false);
  }

  return (
    <>
      <Map
        aircraftPosition={aircraftPosition}
        defaultZoom={17}
        host={host}
        port={port}
        setHost={setHost}
        setPort={setPort}
        connecting={connecting}
        setConnecting={setConnecting}
        connected={connected}
        connectAerowinx={connectAerowinx}
        disconnectAerowinx={disconnectAerowinx}
      />
    </>
  )
}