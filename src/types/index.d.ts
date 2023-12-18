export {};

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
  }
}