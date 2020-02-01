import * as React from "react";
import { __RouterContext, Router, Route } from "react-router";
import { omit } from "lodash";

export function stripTrailingSlash(path) {
  if (!path) return "";
  return path.charAt(path.length - 1) === "/" ? path.slice(0, -1) : path;
}
export function addLeadingSlash(path) {
  if (!path) return "";
  return path.charAt(0) === "/" ? path : "/" + path;
}

export function isCompositeTypeElement(element) {
  return React.isValidElement(element) && typeof element.type === "function";
}
interface Context {
  path?: string;
}
// 路径context
const RouteProviderContext = React.createContext<Context>({ path: "/" });
// 高层父组件，用于提供包装支持
export default function RouteProvider(props) {
  const reactRouterContext = React.useContext(__RouterContext);
  // 通过history的有无判断是否应该实例化顶层Router
  const history = reactRouterContext && reactRouterContext.history;
  const ReactRouter = history
    ? (props: { children: React.ReactElement }) => {
        return props.children;
      }
    : Router;
  // 使用WrapComponentEachChild提升各子组件
  return (
    <ReactRouter history={props.history}>
      <WrapComponentEachChild>{props.children}</WrapComponentEachChild>
    </ReactRouter>
  );
}
export function WrapComponentEachChild(props) {
  // 使用map保证child都有key值
  const wrappedChildren = React.Children.map(props.children, childElement => {
    return <WrapComponent>{childElement}</WrapComponent>;
  });
  return <>{wrappedChildren}</>;
}

// 所有element应该包裹WrapComponent
function WrapComponent(props) {
  const context = React.useContext(RouteProviderContext);
  const element = props.children;
  if (typeof element !== "object") {
    // 如果是基本元素，数字，字符串，直接返回
    return element;
  }
  const path = element && element.props && element.props.path;
  const remainDom = element && element.props && element.props.remainDom;
  // 拼接上下文中的path与本级path，构成当前路径
  const currentPath = `${stripTrailingSlash(
    addLeadingSlash(context.path)
  )}${addLeadingSlash(path)}`;
  // 获得element的children
  const childElements = element && element.props && element.props.children;
  // 在使用Route路由支持的同时，也使用WrapComponentEachChild提升其各子组件
  const enhancedElement = React.cloneElement(
    element,
    {},
    childElements ? (
      // 使用WrapComponentEachChild提升element的children
      <WrapComponentEachChild>{childElements}</WrapComponentEachChild>
    ) : (
      undefined
    )
  );
  /* 
    通过判断是否有path属性且element是组件(类组件，函数组件)，则应该包裹Route
  */
  return path && isCompositeTypeElement(element) ? (
    // 为后代组件提供新的路径
    <RouteProviderContext.Provider value={{ path: currentPath }}>
      <Route
        // 还可接受exact,strict等参数
        {...omit(element.props, "component", "render")}
        path={currentPath}
        children={routeProps => {
          const routeEnhancedElement = React.cloneElement(
            enhancedElement,
            routeProps
          );
          /* 
            业务组件除了path外，也可以传入remainDom，这时组件无条件渲染
            同时业务组件接受到routeProps，可自行判断渲染
          */
          if (remainDom) {
            return routeEnhancedElement;
          } else {
            return routeProps.match ? routeEnhancedElement : null;
          }
        }}
      />
    </RouteProviderContext.Provider>
  ) : (
    // 返回提升过的元素，使得递归子元素
    enhancedElement
  );
}
