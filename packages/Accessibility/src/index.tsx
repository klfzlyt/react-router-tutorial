import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import ReactDOM from "react-dom";
import withARIA from "./components/aria";
function Home() {
  return <>Home</>;
}
function User() {
  return <>User</>;
}

/* 引入高阶组件获得ARIA支持 */
const UserWithARIA = withARIA(User);
function Example() {
  return (
    <Router>
      <header>
        <NavLink style={{marginRight:'10px'}} to="/">Home</NavLink>
        <NavLink to="/user">User</NavLink>
      </header>
      <Route exact path="/" component={Home} />
      <Route path="/user" component={UserWithARIA} />
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);
