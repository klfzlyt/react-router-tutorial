import * as React from 'react';
import {
  matchPath,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
  __RouterContext,
} from 'react-router';

export function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}

export function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
export function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
interface HookRoutes {
  [key: string]:
    | React.ComponentType<any>
    | { component: React.ComponentType<any>; routeConfig: RouteProps };
}
// 产生 /a /2 格式
function processPath(path: string) {
  if (path === '/') return '';
  return addLeadingSlash(stripTrailingSlash(path));
}

export default function useHookRoutes(routes: HookRoutes) {
  // 获取路由上下文
  const routerContext = React.useContext<RouteComponentProps>(__RouterContext);
  if (!routerContext) return null;
  const { match: parentRouteMatch, location } = routerContext;
  // 手动计算判断，用于返回null的情景
  const isSomeRouteMatched = Object.keys(routes).some(
    (path) =>
      !!matchPath(location.pathname, {
        path: `${processPath(parentRouteMatch.path)}${processPath(path)}`,
        exact: false,
      }),
  );
  // 匹配得到了ReactElement,用于返回
  const element = parentRouteMatch && (
    <Switch>
      {Object.entries(routes).map(([path, component], index) => {
        let routeConfig;
        let Component = component;
        if (typeof component === 'object') {
          routeConfig = component.routeConfig;
          Component = component.component;
        }
        // 获取到上下文中的路径，构成嵌套路径
        const pathRoute = `${processPath(parentRouteMatch.path)}${processPath(
          path,
        )}`;
        return (
          <Route
            exact={false}
            key={index}
            path={pathRoute}
            render={(routeProps: RouteComponentProps) => {
              return React.createElement(
                Component as React.ComponentType<any>,
                routeProps,
              );
            }}
            {...routeConfig}
          />
        );
      })}
    </Switch>
  );
  // 在未匹配路由的情况下，返回null，提供业务侧判断
  if (!isSomeRouteMatched) {
    return null;
  }
  return element;
}
