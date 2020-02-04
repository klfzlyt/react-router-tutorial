import * as React from "react";
import { __RouterContext, matchPath, SwitchProps } from "react-router";
import invariant from "tiny-invariant";
const RouterContext = __RouterContext;
interface SwitchPropsExt extends SwitchProps {
  // 不缓存模式
  noCache?: boolean;
}
function CacheSwitch(props: SwitchPropsExt) {
  // 需要一个数组记录哪些子组件曾经渲染过
  const renderedComponentsRef = React.useRef<string[]>([]);
  return (
    <RouterContext.Consumer>
      {context => {
        const location = props.location || context.location;
        // 用于保存渲染组件的数组 由于CacheSwitch可能渲染多个子组件
        // 不像Switch仅渲染一个子组件 CacheSwitch需要缓存子组件
        // 通过数组保存所有需要渲染的子组件
        const components = [];
        let isMatched = false;
        React.Children.forEach(props.children, child => {
          // 还原Switch的行为 在命中后不再进行后续child的操作
          if (props.noCache && isMatched) {
            return;
          }
          if (React.isValidElement(child)) {
            const element:any = child;
            // 取到Route的path
            const path = element.props.path || element.props.from;
            // 与Switch的match一致
            const match = path
              ? matchPath(location.pathname, { ...child.props, path })
              : context.match;
            const compnentIdentity = element.key || path;
            // 渲染组件方法，通过判断命中数组确保组件命中过
            const renderComponent = forceHide => {
              invariant(compnentIdentity, `请确认组件${element.type}的key`);
              // 曾经渲染过的组件应该继续渲染，隐藏与否根据forceHide参数决定
              renderedComponentsRef.current.includes(compnentIdentity) &&
                components.push(
                  // 使用cloneElement保留原element的props
                  React.cloneElement(element, {
                    // 与Switch一致，将Switch的location传入Route
                    location,
                    // 为Route传入computedMatch，Route便无需再计算一次命中情况
                    computedMatch: match,
                    // 在noCache时 Route行为与原生一致，
                    // 使用6.7.5小节中的 CacheRoute需要传入对应字段
                    shouldDestroyDomWhenNotMatch: props.noCache,
                    // 渲染组件的css强制控制
                    forceHide: forceHide,
                    // 使用key是必要的，因为Switch下的children是组件数组
                    // 优先使用element的key，如果没有，使用path作为key
                    key: compnentIdentity
                  })
                );
            };
            if (match) {
              if (!isMatched) {
                //  此组件已经满足渲染要求 更新标识符
                !renderedComponentsRef.current.includes(compnentIdentity) &&
                  renderedComponentsRef.current.push(compnentIdentity);
                //第一次匹配成功
                isMatched = true;
                //第一次匹配成功，不强制隐藏
                renderComponent(false);
              } else {
                //非第一次匹配成功，强制隐藏
                renderComponent(true);
              }
            } else {
              //未匹配成功，强制隐藏
              renderComponent(true);
            }
          }
        });
        // 更新一次标识组件渲染的数组，以满足在key变化时，旧的key能得到清理
        renderedComponentsRef.current = components.map(element => element.key);
        return components;
      }}
    </RouterContext.Consumer>
  );
}
export default CacheSwitch;
