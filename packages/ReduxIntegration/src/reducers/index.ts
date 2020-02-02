import { combineReducers } from 'redux'
import { History } from 'history'
import { RouterState, connectRouter } from 'connected-react-router'
import counterReducer from './counter'

const rootReducer = (history: History) => combineReducers({
  count: counterReducer,
  // 创建根reducer时，设置router属性
  router: connectRouter(history)
})

export interface State {
  count: number
  router: RouterState
}

export default rootReducer
