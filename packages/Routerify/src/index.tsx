

import * as React from "react";
import { render } from "react-dom";
import {Switch} from 'react-router';
import { createBrowserHistory } from "history";
import RouteProvider from "./RouteProvider";
import A from "./A";
import B from "./B";
import { Redirect,Link } from "react-router-dom";
const history = createBrowserHistory();
function App() {
  return (
    <div className="App">
      <RouteProvider history={history}>
        <div>
          <Switch>
            <Redirect exact from="/" to="/a"/>
          </Switch>
          <Link to="/b">to b</Link>
          <A path="/a" />
          <B path="/b" />
        </div>    
      </RouteProvider>
    </div>
  );
}
const rootElement = document.getElementById("root");
render(<App />, rootElement);
