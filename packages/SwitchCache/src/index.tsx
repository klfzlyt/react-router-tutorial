import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Router } from "react-router";
import { Link } from "react-router-dom";
import CacheRoute from "./CacheRoute";
import CacheSwitch from "./SwitchCache";

function A() {
  return (
    <>
      a<input />
    </>
  );
}
function B() {
  return (
    <>
      b<input />
    </>
  );
}
function C() {
  return (
    <>
      c<input />
    </>
  );
}
function D() {
  return (
    <>
      d<input />
    </>
  );
}
// 仅需使用一个createBrowserHistory就够了
const history = createBrowserHistory();

function App() {
  return (
    <CacheSwitch>
      {/* /a /b 匹配命中*/}
      <CacheRoute path="/([ab])" component={A} />
      {/* /b得不到渲染 */}
      <CacheRoute path="/b" component={B} />
      <CacheRoute path="/c" component={C} />
      <CacheRoute path="/d" component={D} />
    </CacheSwitch>
  );
}

const rootElement = document.getElementById("root");
render(
  <Router history={history}>
    <div>
      <Link style={{marginRight:'10px'}} to="/a" children="a" />
      <Link style={{marginRight:'10px'}} to="/b" children="b" />
      <Link style={{marginRight:'10px'}} to="/c" children="c" />
      <Link to="/d" children="d" />
      <div>仅渲染一个子Route</div>
    </div>
    <App />
  </Router>,
  rootElement
);
