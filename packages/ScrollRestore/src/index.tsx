import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { RouteChildrenProps } from "react-router";
import { Route, Router, Link } from "react-router-dom";
import ListDetail from "./detail";
import LongList1 from "./list1";
import LongList2 from "./list2";
import LongList3 from "./list3";
import LongList4 from "./list4";
import ScrollManager from "./scroll/scroll-manager";
import "./styles.css";
const history = createBrowserHistory();
window.history.scrollRestoration = "auto";
class App extends React.Component {
  onClick() {
    this.setState({
      a: 1
    });
  }
  public render() {
    return (
      <ScrollManager history={history}>
        <Router history={history}>
          <h4>滚动恢复</h4>
          <button onClick={this.onClick.bind(this)}>update</button>
          <Link to="/list1">
            列表每次销毁重建（remount）&& 路由保留外层dom，display隐藏
          </Link>
          <Link to="/list2">路由不保留dom，整个路由组件销毁</Link>
          <Link to="/list3">完全保留dom</Link>
          <Link to="/list4">拉取数据渲染列表</Link>
          <Route
            path="/list1"
            children={(props: RouteChildrenProps) => (
              <div style={{ display: props.match ? "block" : "none" }}>
                <LongList1 {...props} />
              </div>
            )}
          />
          <Route path="/list2" component={LongList2} />
          <Route
            path="/list3"
            children={(props: RouteChildrenProps) => (
              <div style={{ display: props.match ? "block" : "none" }}>
                <LongList3 {...props} />
              </div>
            )}
          />
          <Route path="/list4" component={LongList4} />
          <Route path="/detail" component={ListDetail} />
        </Router>
      </ScrollManager>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
