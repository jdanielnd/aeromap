export {};

declare global {
  interface Window {
    api: {
      connect: () => void,
      setConnected: (setConnected: Function) => void,
      getPosition: () => Promise<Position>,
    };
  }
}