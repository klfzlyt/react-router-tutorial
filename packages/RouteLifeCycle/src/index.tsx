import { createBrowserHistory } from 'history';
import * as React from 'react';
import { render } from 'react-dom';
import { Route, Router } from 'react-router';
import { Link } from 'react-router-dom';
import withRouteLifeCycle, { LifeCycleCompoent } from './RouteLifeCycle';
import './styles.css';
const Comp1 = withRouteLifeCycle(LifeCycleCompoent);
const Comp2 = withRouteLifeCycle(LifeCycleCompoent);
const Comp3 = withRouteLifeCycle(LifeCycleCompoent);
const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Link to="/a">/a</Link>
        <Link to="/b/10">/b/10(使用同一个Component)</Link>
        <Link to="/b/20">/b/20(使用同一个Component)</Link>
        <Link to="/c">/c</Link>
        <Link to="?c=1">改变search</Link>
        <Link to="#somehash">改变hash</Link>
        <Route
          path="/a"
          children={(props) => {
            return (
              <div style={{ display: props.match ? 'block' : 'none' }}>
                <Comp1 {...props} />
              </div>
            );
          }}
        />
        <Route
          path="/b/:id"
          children={(props) => {
            return (
              <div style={{ display: props.match ? 'block' : 'none' }}>
                <Comp2 {...props} />
              </div>
            );
          }}
        />
        <Route path="/c" component={Comp3} />
      </Router>
    </div>
  );
}
render(<App />, document.getElementById('root'));
