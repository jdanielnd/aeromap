import settings from 'electron-settings';

export const alwaysOnTopStateKeeper = async (windowName: string) => {
  let alwaysOnTopState: boolean;

  if (await settings.has(`alwaysOnTop.${windowName}`)) {
    alwaysOnTopState = !!(await settings.get(`alwaysOnTop.${windowName}`));
  } else {
    settings.set(`alwaysOnTop.${windowName}`, false);
  }

  const setAlwaysOnTopState = async (state: boolean) => {
    await settings.set(`alwaysOnTop.${windowName}`, state);
    alwaysOnTopState = state;
  };

  return {
    alwaysOnTopState,
    setAlwaysOnTopState,
  };
};