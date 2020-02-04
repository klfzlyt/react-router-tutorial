import { createBrowserHistory } from 'history';
import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Link, Route } from 'react-router-dom';
import LocatedElement from './LocateElement';
import A from './A';
import B from './B';
// 仅需使用一个createBrowserHistory就够了
const history = createBrowserHistory();

function App() {
  return (
    <>
      <Route path="/a" component={A} />
      <Route path="/b" component={B} />
    </>
  );
}

const rootElement = document.getElementById('root');
render(
  <Router history={history}>
    <LocatedElement>
      <div>
        <Link style={{ marginRight: '20px' }} to="/a#40" children="a" />
        <Link style={{ marginRight: '20px' }} to="/b#50" children="b" />
      </div>
      <div>定位元素</div>
      <App />
    </LocatedElement>
  </Router>,
  rootElement,
);
