import { createBrowserHistory } from 'history';
import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import useHookRoutes from './hook-route';
import PoiList from './pages/poiList';
import { Redirect, Switch } from 'react-router-dom';
import "./style.css"
const history = createBrowserHistory();

const routesConfigs = {
  '/list': PoiList,
};
function App() {
  const components = useHookRoutes(routesConfigs);
  return components;
}
render(
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/list" />
    </Switch>
    <App />
  </Router>,
  document.getElementById('root'),
);
