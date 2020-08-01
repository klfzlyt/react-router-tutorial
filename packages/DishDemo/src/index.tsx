import * as React from "react";
import { render } from "react-dom";
import { Router, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import PoiList from "./pages/poiList";
import PoiDetail from "./pages/poiDetail";
import DishDetail from "./pages/dishDetail";
import "./styles.css";
const history = createBrowserHistory();
function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Route path="/poi-list" component={PoiList} />
        <Route path="/poi-detail" component={PoiDetail} />
        <Route path="/dish-detail" component={DishDetail} />
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
