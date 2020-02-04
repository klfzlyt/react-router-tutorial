import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Router } from "react-router";
import { Link } from "react-router-dom";
import CacheRoute from "./CacheRoute";

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
    <>
      <CacheRoute path="/a" component={A} />
      <CacheRoute path="/b" component={B} />
      <CacheRoute path="/c" component={C} />
      <CacheRoute path="/d" component={D} />
    </>
  );
}

const rootElement = document.getElementById("root");
render(
  <Router history={history}>
    <div>
      <Link style={{marginRight:'20px'}} to="/a" children="a" />
      <Link style={{marginRight:'20px'}} to="/b" children="b" />
      <Link style={{marginRight:'20px'}} to="/c" children="c" />
      <Link to="/d" children="d" />
    </div>
    <div>在输入框内输入任意字符，切换导航，字符被缓存</div>
    <App />
  </Router>,
  rootElement
);
