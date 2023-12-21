
import { Button, Modal, ToggleSwitch, Label, TextInput, FooterDivider } from 'flowbite-react';
import { useState } from 'react';

export function Settings(
  { host, port, setHost, setPort, connecting, connected, connectAerowinx, disconnectAerowinx }:
  {
    host: string,
    port: number,
    setHost: (host: React.SetStateAction<string>) => void,
    setPort: (port: React.SetStateAction<number>) => void
    connecting: boolean,
    setConnecting: (isConnecting: boolean) => void,
    connected: boolean,
    connectAerowinx: () => void,
    disconnectAerowinx: () => void
  }) {
  const [openModal, setOpenModal] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);

  const onChangeAlwaysOnTop = () => {
    const nextAlwaysOnTop = !alwaysOnTop;
    setAlwaysOnTop(nextAlwaysOnTop);
    window.api.setAlwaysOnTop(nextAlwaysOnTop);
  }

  const onChangeHost = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextHost = event.target.value;
    setHost(nextHost);
    window.api.setHost(nextHost);
  }

  const onChangePort = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPort = Number(event.target.value);
    setPort(nextPort);
    window.api.setPort(nextPort);
  }

  const onChangeAutoConnect = () => {
    const nextAutoConnect = !autoConnect;
    setAutoConnect(nextAutoConnect);
    window.aerowinxApi.setAutoConnect(nextAutoConnect);
  }

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Settings</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body>
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="host" value="Host" />
              </div>
              <TextInput id="host" type="text" placeholder="127.0.0.1" value={host} onChange={onChangeHost} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="port" value="Port" />
              </div>
              <TextInput id="port" type="text" placeholder="10747" value={port} onChange={onChangePort} />
            </div>
            <div>
              <ToggleSwitch checked={alwaysOnTop} label="Always on top" onChange={onChangeAlwaysOnTop} />
            </div>
          </form>
          <FooterDivider />
          <div className="grid grid-cols-2">
            <div className="flex flex-col space-y-2">
              <dl className="flex flex-col gap-2">
                <dt>Connected</dt>
                <dd>{connected ? 'Yes' : 'No'}</dd>
              </dl>
              <dl className="flex flex-col gap-2">
                <dt>Connecting</dt>
                <dd>{connecting ? 'Yes' : 'No'}</dd>
              </dl>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <Button onClick={() => connectAerowinx()} disabled={connected || connecting}>Connect</Button>
                <Button color="gray" onClick={() => disconnectAerowinx()} disabled={!connected && !connecting}>
                  Disconnect
                </Button>
              </div>
              <div>
                <ToggleSwitch checked={autoConnect} label="Auto-connect" onChange={onChangeAutoConnect} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
