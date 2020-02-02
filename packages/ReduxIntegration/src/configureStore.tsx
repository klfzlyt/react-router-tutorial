import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'

export const history = createBrowserHistory()

export default function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    // root
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        // 提供路由中间件
        routerMiddleware(history),
      ),
    ),
  )

  return store
}
