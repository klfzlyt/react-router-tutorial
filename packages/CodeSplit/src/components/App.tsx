import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from "./Home";
import DynamicImport from "./DynamicImport";
import Loadable from "react-loadable"; 

const DynamicSettings = props => (
  <DynamicImport load={() => import("./Settings")} render={Component =>
    Component === null ? <p>Loading ...</p> : <Component {...props} />}/>
);

const LazyTopics = React.lazy(() => import("./Topics"));
const LoadableUserComponent = Loadable({
  loader: () => import("./User"),
  loading: () => {
    return <div>Loading ...</div>;
  }
});

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user">User (react-loadable)</Link>
            </li>
            <li>
              <Link to="/topics">Topics (React.lazy)</Link>
            </li>
            <li>
              <Link to="/settings">Settings (dynamic import)</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <React.Suspense fallback={<p>Loading ...</p>}>
            <Route path="/topics" component={LazyTopics} />
          </React.Suspense>
          <Route path="/settings" component={DynamicSettings} />
          <Route path="/user" component={LoadableUserComponent} />
        </div>
      </Router>
    );
  }
}

export default App;
