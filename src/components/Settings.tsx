
import { set } from 'electron-settings';
import { Button, Modal, ToggleSwitch, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

export function Settings() {
  const [openModal, setOpenModal] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState('10747');

  useEffect(() => {
    const getSettings = async () => {
      const currentAlwaysOnTop = await window.api.getAlwaysOnTop()
      setAlwaysOnTop(currentAlwaysOnTop)

      const currentHost = await window.api.getHost()
      setHost(currentHost)

      const currentPort = await window.api.getPort()
      setPort(currentPort)
    }
    getSettings();
  }, []);

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
    const nextPort = event.target.value;
    setPort(nextPort);
    window.api.setPort(nextPort);
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
              <TextInput id="host" type="text" placeholder="127.0.0.1" value={host} onChange={onChangeHost}/>
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
