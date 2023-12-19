export { };

declare global {
  interface Window {
    api: {
      setAlwaysOnTop: (alwaysOnTop: boolean) => void,
      getAlwaysOnTop: () => Promise<boolean>,
    },
    aerowinxApi: {
      connect: ({ host: string, port: number }) => void,
      close: () => void,
      onConnected: (callback: () => void) => void,
      onReady: (callback: () => void) => void,
      onData: (callback: (data) => void) => void,
      onQs121: (callback: (data) => void) => void,
      onClosed: (callback: () => void) => void,
      onError: (callback: (error) => void) => void,
      onTimeout: (callback: () => void) => void,
      setAutoConnect: (autoConnect: boolean) => void,
      removeListeners: () => void,
    },
  }
}