/*
    示例来自http://reactcommunity.org/react-transition-group/with-react-router
    具体分析详见书中8.6.1小节
*/
import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, NavLink, Route } from 'react-router-dom'
/* 
    本例无需TransitionGroup
    使用TransitionGroup示例，需保证key：
    https://reacttraining.com/react-router/web/example/animated-transitions    
*/
import { CSSTransition } from 'react-transition-group'
import About from './pages/about'
import Contact from './pages/contact'
import Home from './pages/home'
import './styles.css'

const routes = [
  { path: '/', name: 'Home', Component: Home },
  { path: '/about', name: 'About', Component: About },
  { path: '/contact', name: 'Contact', Component: Contact },
]

function Example() {
  return (
    <Router>
      <>
        <Navbar bg="light">
          <Nav className="mx-auto">
            {routes.map(route => (
              <Nav.Link
                key={route.path}
                as={NavLink}
                to={route.path}
                activeClassName="active"
                exact
              >
                {route.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar>
        <Container className="container">
          {routes.map(({ path, Component }) => (
            <Route key={path} exact path={path}>
              {/* children 作为函数 无条件调用 */}
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  /*300毫秒后销毁子组件*/
                  timeout={300}
                  /* 会应用 page-enter page-enter-active page-exit page-exit-active */
                  classNames="page"
                  /* 退出时销毁组件 */
                  unmountOnExit
                >
                  <div className="page">
                    <Component />
                  </div>
                </CSSTransition>
              )}
            </Route>
          ))}
        </Container>
      </>
    </Router>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Example />, rootElement)
