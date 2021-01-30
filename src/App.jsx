import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import {HashRouter, Link, Route, Switch} from "react-router-dom";

import { ipcRenderer } from "electron";

import Map from './components/map/index.jsx'

function Settings(props) {
  return <h2>Settings: {props.connected ? "Conectado" : "Desconectado"}</h2>;
}

function App(props) {

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Atualiza o titulo do documento usando a API do browser
    const interval = setInterval(() => {
      ipcRenderer.send('connection')
    }, 1000);
    return () => clearInterval(interval);
  });

  ipcRenderer.on('connection-reply', (event, arg) => {
    setConnected(arg)
  })

  return (
    <HashRouter>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/settings">
            <Settings connected={connected} />
          </Route>
          <Route exact path="/" render={() => {
            return (
              connected ?
              <Map /> :
              <Settings />
            )
          }}/>
        </Switch>

        <nav>
          <ul>
            <li>
              <Link to="/">Map</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>
    </HashRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
