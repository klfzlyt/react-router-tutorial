import { createBrowserHistory } from 'history';
import * as React from 'react';
import { render } from 'react-dom';
import { Route, Router } from 'react-router';
import applyMiddleware, { middware1, middware2, middware3 } from './middleware';
import { Link } from 'react-router-dom';
function Home(props) {
  return <div>Home组件</div>;
}
function B(props) {
  return <div>B组件</div>;
}
function C(props) {
  return <div>C组件</div>;
}
function Login(props) {
  return (
    <div>
      <div>您未登录，请输入账号密码</div>
      <div>
        账号：
        <input type="text" />
      </div>
      <div>
        密码：
        <input type="password" />
      </div>
    </div>
  );
}

const history = createBrowserHistory();
applyMiddleware(history, [middware1, middware2, middware3]);

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Link style={{ marginRight: '10px' }} to="/">
          Home
        </Link>
        <Link style={{ marginRight: '10px' }} to="/b">
          to B
        </Link>
        <Link to="/c">to C</Link>
        <Route exact path="/" component={Home} />
        <Route
          path="/b"
          render={(props) => {
            return <B {...props} />;
          }}
        />
        <Route
          path="/c"
          render={(props) => {
            return <C {...props} />;
          }}
        />
        <Route
          path="/login"
          render={(props) => {
            return <Login />;
          }}
        />
      </Router>
    </div>
  );
}
render(<App />, document.getElementById('root'));
