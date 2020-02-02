import * as React from "react";
import { useContext } from "react";
import { match, __RouterContext as RouterContext } from "react-router";
import { IManager, ScrollManagerContext } from "./scroll-manager";

interface IProps {
  // 必须！！！缓存的key
  scrollKey: string;
  children: React.ReactElement;
  // 为true触发滚动恢复
  when?: boolean;
  // 外部传得有ref
  getRef?: () => HTMLElement;
}

export default function(props: IProps) {
  const nodeRef = React.useRef<HTMLElement>();
  const manager: IManager = useContext<IManager>(ScrollManagerContext);
  const currentMatch = useContext(RouterContext).match;
  const previewMatchRef = React.useRef<match | null>(null);
  React.useEffect(() => {
    const handler = function(event: Event) {      
      if (nodeRef.current === event.target) {
        manager.setLocation(props.scrollKey, nodeRef.current);
      }
    };
    // 在window上监听scroll事件，获取scroll事件触发target，并更新位置
    window.addEventListener("scroll", handler, true);
    // 移除事件
    return () => window.removeEventListener("scroll", handler, true);
  }, [props.scrollKey]);
  React.useLayoutEffect(() => {
    if (props.getRef) {
      // 获取ref
      nodeRef.current = props.getRef();
    }
    if (currentMatch) {
      // 设置标志，表明在location改变时，可以保存路径
      manager.setMatch(props.scrollKey, true);
      // 更新ref，代理的dom可能会remount，所以要每次更新
      nodeRef.current &&
        manager.registerOrUpdateNode(props.scrollKey, nodeRef.current);
      // 恢复原先滑动过的位置，可通过外部props通知是否需要进行恢复，一般为:when={xxx.length>0}
      (props.when === undefined || props.when) &&
        manager.restoreLocation(props.scrollKey);
    } else {
      // 没命中设置标志，不要保存路径
      manager.setMatch(props.scrollKey, false);
    }
    previewMatchRef.current = currentMatch;
    // 销毁时注销这个node 每次update注销，并重新注册最新的nodeRef
    return () => manager.unRegisterNode(props.scrollKey);
  });
  if (props.getRef) {
    return props.children;
  }
  const onlyOneChild = React.Children.only(props.children);
  // 代理第一个child，需要是真实的dom，div,h1,h2……不能是组件
  if (onlyOneChild && onlyOneChild.type && typeof onlyOneChild.type === "string") {
    // 必须是 原生tag
    return React.cloneElement(onlyOneChild, { ref: nodeRef });
  } else {
    console.warn(
      "-------------滚动恢复将失效，ScrollElement的children须为原生的单个html标签-------------"
    );
    return props.children;
  }
}
