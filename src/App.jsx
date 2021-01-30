import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter,Link,Route,Switch} from "react-router-dom";

import Map from './components/map/index.jsx'

function Users() {
  return <h2>Settings</h2>;
}

function App(props) {
  return (
    <HashRouter>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/settings">
            <Users />
          </Route>
          <Route path="/">
            <Map />
          </Route>
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
