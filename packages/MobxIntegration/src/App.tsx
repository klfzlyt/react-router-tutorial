/*
  示例源自：
  https://github.com/alisd23/mobx-react-router
*/
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing')
@observer
export default class App extends Component<any> {
  render() {
    const { location, push, goBack } = this.props.routing;

    return (
      <div>
        <span>mobx location.pathname state: {location.pathname}</span>
        {/*等同于history.push('/test')*/}
        <button onClick={() => push('/test')}>前往 /test</button>
        {/*等同于history.goBack()*/}
        <button onClick={() => goBack()}>返回</button>
      </div>
    );
  }
}