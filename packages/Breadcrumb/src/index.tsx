import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Router } from "react-router";
import { Link } from "react-router-dom";
import withBreadcrumbs from "./bread-crumb";
import "./styles.css";
// Breadcrumb的签名，有url与name属性
export interface Breadcrumb {
  url: string;
  name: string;
}
function BreadCrumbs(props: { breadcrumbs: Breadcrumb[] }) {
  console.log(" props.breadcrumbs", props.breadcrumbs);
  // 通过withBreadcrumbs注入了breadcrumbs
  return props.breadcrumbs.map(breadcrumb => {
    // 可渲染每个导航Link
    return <Link to={breadcrumb.url}>{breadcrumb.name}</Link>;
  });
}
const BreadCrumbsHoc = withBreadcrumbs([
  { path: "/", name: "首页" },
  {
    path: "/user",
    exclude: true
  }
])(BreadCrumbs);
function App() {
  return (
    <Router history={createBrowserHistory()}>
      <Link to="/user/1">用户1</Link>
      <div />
      <BreadCrumbsHoc />
    </Router>
  );
}
render(<App />, document.getElementById("root"));
