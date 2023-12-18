export { };

declare global {
  interface Window {
    api: {
      connect: () => void,
      setConnected: (setConnected: Function) => void,
      getPosition: () => Promise<Position>,
      getConnection: () => Promise<boolean>,
      setAlwaysOnTop: (alwaysOnTop: boolean) => void,
      getAlwaysOnTop: () => Promise<boolean>,
      getHost: () => Promise<string>,
      setHost: (host: string) => void,
      getPort: () => Promise<string>,
      setPort: (port: string) => void,
    },
    aerowinxApi: {
      connect: ({ host: string, port: number }) => void,
      close: () => void,
      onConnected: (callback: Function) => void,
      onReady: (callback: Function) => void,
      onData: (callback: Function) => void,
      onQs121: (callback: Function) => void,
      onClosed: (callback: Function) => void,
      onError: (callback: Function) => void,
      onTimeout: (callback: Function) => void,
      setAutoConnect: (autoConnect: boolean) => void,
      removeListeners: () => void,
    },
  }
}