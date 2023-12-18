import { ipcMain } from 'electron';
import settings from 'electron-settings';

export const hostSettings = async () => {
  let host;
  let port;

  if (await settings.has('host')) {
    host = await settings.get('host');
  } else {
    settings.set('host', '1278.0.0.1');
  }

  if (await settings.has('port')) {
    port = await settings.get('port');
  } else {
    settings.set('port', '10747');
  }

  const setHost = async (state) => {
    await settings.set('host', state);
    host = state;
  };
  
  const setPort = async (state) => {
    await settings.set('port', state);
    port = state;
  };

  return {
    host,
    port,
    setHost,
    setPort,
  };
};