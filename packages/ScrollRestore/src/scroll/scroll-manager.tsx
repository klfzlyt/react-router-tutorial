/*
    ScrollManager
    使用一个顶层组件保存所有的节点信息，通过context传递下去
*/
import { History } from "history";
import * as React from "react";
interface IProps {
  history: History;
  children: React.ReactNode;
  restoreInterval?: number;
  tryRestoreTimeout?: number;
}
export interface IManager {
  registerOrUpdateNode: (key: string, node: HTMLElement) => void;
  setLocation: (key: string, node: HTMLElement | null) => void;
  setMatch: (key: string, matched: boolean) => void;
  restoreLocation: (key: string) => void;
  unRegisterNode: (key: string) => void;
}
const noop = (...args: any[]) => {};
export const ScrollManagerContext = React.createContext<IManager>({
  setMatch: noop,
  setLocation: noop,
  registerOrUpdateNode: noop,
  restoreLocation: noop,
  unRegisterNode: noop
});
// 可取消，为cancelable的，用setInterval不大好，可用observaMutaion
const tryMutilTimes = (
  callback: (...args: any[]) => void,
  tickInterval: number,
  timeout: number
) => {
  const timeId = setInterval(callback, tickInterval);
  setTimeout(() => {
    clearTimeout(timeId);
  }, timeout);
  return () => clearTimeout(timeId);
};
export default function(props: IProps) {
  const [shouldChild, setShouldChild] = React.useState(false);
  /*
        注册缓存内存，类似this.cache
    */
  const locationCache = React.useRef<{
    [key: string]: { x: number; y: number };
  }>({});
  const nodeCache = React.useRef<{ [key: string]: HTMLElement | null }>({});
  const matchCache = React.useRef<{ [key: string]: boolean }>({});
  const cancelRestoreFnCache = React.useRef<{ [key: string]: () => void }>({});
  // context的值
  const manager = {
    registerOrUpdateNode: (key: string, node: HTMLElement) => {
      nodeCache.current[key] = node;
    },

    setMatch: (key: string, matched: boolean) => {
      matchCache.current[key] = !!matched;
      if (!matched) {
        // 及时清除
        cancelRestoreFnCache.current[key] &&
          cancelRestoreFnCache.current[key]();
      }
    },

    unRegisterNode: (key: string) => {
      nodeCache.current[key] = null;
      // 及时清除
      cancelRestoreFnCache.current[key] && cancelRestoreFnCache.current[key]();
    },

    setLocation: (key: string, node: HTMLElement | null) => {
      if (!node) {
        return;
      }
      locationCache.current[key] = { x: node.scrollLeft, y: node.scrollTop };
    },

    restoreLocation: (key: string) => {
      if (!locationCache.current[key]) {
        return;
      }
      const { x, y } = locationCache.current[key];
      let shoudNextTick = true;
      cancelRestoreFnCache.current[key] = tryMutilTimes(
        () => {
          if (shoudNextTick && nodeCache.current[key]) {
            nodeCache.current[key]!.scrollLeft = x;
            nodeCache.current[key]!.scrollTop = y;
            // 如果恢复成功 就取消，不用再恢复了
            if (
              nodeCache.current[key]!.scrollTop === y &&
              nodeCache.current[key]!.scrollLeft === x
            ) {
              shoudNextTick = false;
              cancelRestoreFnCache.current[key]();
            }
          }

          // 每隔50ms试一次恢复，试到500ms结束， 时间可配置
        },
        props.restoreInterval || 50,
        props.tryRestoreTimeout || 500
      );
    }
  };
  React.useLayoutEffect(() => {
    const unlisten = props.history.listen((_location, _action) => {
      // 每次location变化时，保存结点信息
      // 这个回调要在history的所有回调中第一个执行，原因是这个时候还没进行setState,并且即将要进行setState,在这个回调中拿到的状态或者dom属性是进行状态更新前的
      const cacheNodes = Object.entries(nodeCache.current);
      cacheNodes.forEach(entry => {
        const [key, node] = entry;
        // matchCache为true，表明从当前match(路由渲染的页面)离开,所以离开之前，保存scroll
        if (matchCache.current[key]) {
          manager.setLocation(key, node);
        }
      });
    });
    // 保证先监听完上面的回调函数后，才实例化Router!!!! 保证了上面的回调函数最先入栈
    setShouldChild(true);
    return () => {
      // reset所有缓存 防止内存泄露
      locationCache.current = {};
      matchCache.current = {};
      nodeCache.current = {};
      cancelRestoreFnCache.current = {};
      Object.values(cancelRestoreFnCache.current).forEach(
        cancel => cancel && cancel()
      );
      unlisten();
    };
    // 依赖为空，didmount与unmount
  }, []);

  return (
    <ScrollManagerContext.Provider value={manager}>
      {shouldChild && props.children}
    </ScrollManagerContext.Provider>
  );
}
