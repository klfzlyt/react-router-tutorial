import React, { useLayoutEffect } from 'react';
import { __RouterContext } from 'react-router';

// 在一定时间内多次执行callback
const tryMutilTimes = (
  // eslint-disable-next-line
  callback: (...args: any[]) => void,
  tickInterval: number,
  timeout: number,
) => {
  const timeId = setInterval(callback, tickInterval);
  setTimeout(() => {
    clearTimeout(timeId);
  }, timeout);
  return () => clearTimeout(timeId);
};
function locationHash(location, action) {
  // 这里的location不区分browserRouter或者hashRouter，统一都有hash值
  if (typeof location.hash === 'string' && location.hash.length > 1) {
    const elementId = location.hash.substring(1);
    // 多次尝试机制
    const cancelTry = tryMutilTimes(
      () => {
        // 获取到原生元素
        const nvElement = document.getElementById(elementId);
        if (nvElement) {
          nvElement.scrollIntoView();
          cancelTry();
        }
      },
      10,
      100,
    );
  }
}

// 注意要放到Router的子元素下
export default function(props) {
  //  相当于调用了Context.Consumer，当context.Provider的value更新时，使用到
  //  Context.Consumer的组件会重新渲染，这里利用了这一特性
  const { history } = React.useContext(__RouterContext);
  useLayoutEffect(() => {
    const { location, action } = history;
    // 根据hash定位元素，将history中的location传入
    locationHash(location, action);
  });
  return props.children;
}

// 父组件提供hash定位支持
export function ElementLocated(props) {
  const router = React.useContext(__RouterContext);
  const { location, match, history } = router;
  // 父组件 在effect中处理dom的相关操作
  React.useLayoutEffect(() => {
    if (match && locationHash) {
      locationHash(location, history.action);
    }
  });
  return props.children;
}
