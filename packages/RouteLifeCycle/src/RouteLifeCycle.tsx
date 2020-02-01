import {
  __RouterContext as RouterContext,
  RouteComponentProps,
} from 'react-router';
import * as React from 'react';
import { useContext, useEffect, useCallback, useLayoutEffect } from 'react';
// 深度比较
import { isEqual } from 'lodash';
// 可通过props.onLeave注册离开路由回调函数
interface onLeave {
  (cb: onLeaveFuncType): () => void;
}
// 路由退出的回调函数签名
interface onLeaveFuncType {
  // 标记组件离开时dom将是否销毁
  (props?: RouteComponentProps, isUnmount?: boolean): void;
}
// 可通过props.didEnter注册进入路由回调函数
interface didEnter {
  didEnter(cb: didEnterFuncType): () => void;
}
// 路由进入的回调函数签名
interface didEnterFuncType {
  /*
      第一个参数为进入页面时的路由信息，与6.3小节所述一致，可获取到match等值
      第二个参数表示页面切换是否是更新切换，如一个组件在多个路径都能命中，一般是
      Route路径为/user/:id场景，组件在/user/1,/user/2等路径都能渲染，并从
      /user/1 切换到 /user/2
    */
  (props?: RouteComponentProps, isUpdate?: boolean): void;
}
function noop() {}
export default function withRouteLifeCycle(cls) {
  // 记忆业务组件，仅在match有值才渲染组件
  const Cls = React.memo(cls, (_, nextProps) => !nextProps.match);
  return (props) => {
    // 记录上一次命中情况
    const previousMatchRef = React.useRef(null);
    const routeContext = useContext(RouterContext);
    // 从RouterContext获得本次命中情况
    const currentMatch = routeContext.match;
    const previousMatch = previousMatchRef.current;

    // 用于记录didEnter，onLeave回调的refs
    const enter = React.useRef<didEnterFuncType>(noop);
    const leave = React.useRef<onLeaveFuncType>(noop);

    function didEnter(cb: didEnterFuncType) {
      // 保存组件的didEnter回调
      enter.current = cb;
      return () => {
        enter.current = noop;
      };
    }
    function onLeave(cb: onLeaveFuncType) {
      // 保存组件的onLeave回调
      leave.current = cb;
      return () => {
        leave.current = noop;
      };
    }
    // 缓存onLeave，didEnter不用每次都传入新函数到组件中
    const cachedLeave = useCallback(onLeave, [leave.current]);
    const cachedEnter = useCallback(didEnter, [enter.current]);

    useEffect(
      () => () => {
        leave.current(
          {
            ...routeContext,
            location: routeContext.history.location,
            match: previousMatchRef.current,
          },
          // 当组件卸载时，设置unMount标记
          true,
        );
        enter.current = noop;
        leave.current = noop;
      },
      [],
    );
    /* 
       使用useLayoutEffect是为了在浏览器渲染的paint前触发，可以在其中进行dom的操作，
       跟onLeave即将离开一致 
      */
    useLayoutEffect(function useLayoutEffectCallBack() {
      // 上一次渲染命中，本次为命中
      if (!currentMatch && previousMatch) {
        // 退出hook onLeave，没有卸载 但是当前未命中
        leave.current({ ...routeContext, match: previousMatch }, false);
      }
    });
    useEffect(() => {
      // 不相等（deep comparison）触发生命周期，此操作保证了仅在路由变化时触发回调
      if (currentMatch && !isEqual(currentMatch, previousMatch)) {
        if (previousMatch) {
          /*
             使用Promise.resolve延迟执行enter，晚于React的函数作用范围
             目的是使得任何的didEnter回调执行都在onLeave回调之后
             保证执行顺序 onLeave---> didEnter
            */
          Promise.resolve().then(() => {
            // 上次组件渲染 Route也命中，标记为更新，第二个参数为true，并传入当前的Route上下文到回调函数中
            enter.current(routeContext, true);
          });
        } else {
          // 使得任何的didEnter的回调执行都在onLeave回调之后
          // 上次路由渲染未命中
          Promise.resolve().then(() => {
            // 进入hook
            enter.current(routeContext, false);
          });
        }
      }
    });
    previousMatchRef.current = currentMatch;
    return <Cls {...props} onLeave={cachedLeave} didEnter={cachedEnter} />;
  };
}

export function LifeCycleCompoent(props) {
  useEffect(function componentDidmount() {
    // 返回取消监听函数
    /*
         didEnter表示已经进入Route对应页面，回调函数中传入了当前RouteProps与进入模式
         更新进入-->dom不销毁，重新进入-->初始挂载
      */
    const unlisternEnter = props.didEnter((routeProps, isUpdate) => {
      /* 
        由于React Hooks的Capture Value特性，使用props将会只读到第一次渲染的props，可能造成问题
        这里需要使用didEnter 回调中的routeProps
        routeProps在6.3小节曾介绍过
         */
      const log = `${routeProps.match.url}  进入了,
        ${isUpdate ? '更新进入' : '重新进入'}`;
      console.log(log);
    });
    // 返回取消监听函数
    /*
        onLeave表示组件即将离开当前Route页面，isUnmount表示组件在离开页面后是销毁还是css隐藏
       */
    const unlisternLeave = props.onLeave((routeProps, isUnmount) => {
      const log = `${routeProps.match.url}  退出了 ${
        isUnmount ? '组件即将销毁' : '组件隐藏'
      }`;
      console.log(log);
    });
    return function componentUnmount() {
      unlisternEnter && unlisternEnter();
      unlisternLeave && unlisternLeave();
    };
    // 在此处使用[]，仅componentDidmount触发
  }, []);
  return (
    <>
      {props.children}
      <div>打开控制台后点击导航查看路由生命周期信息</div>
    </>
  );
}
