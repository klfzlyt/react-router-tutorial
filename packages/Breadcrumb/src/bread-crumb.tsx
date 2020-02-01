import * as React from "react";
import { matchPath, useLocation } from "react-router";
export interface Breadcrumb {
  url: string;
  name: string;
}
interface config {
  path: string;
  exclude?: boolean;
  name?: string;
}
export function stripTrailingSlash(path:string) {
  return path.charAt(path.length - 1) === "/" ? path.slice(0, -1) : path;
}
function getSegments(pathname: string, configs?: config[]): Breadcrumb[] {
  // 去掉结尾的“/”，如果为根路径会得到空字符串
  const currentPathname = stripTrailingSlash(pathname);
  const breadcrumbs: Breadcrumb[] = [];
  currentPathname
    // 按“/”分割各个segment
    .split("/") // 如果字符串为空字符串 则会得到空数组
    .reduce((previous:string|null, current:string) => {
      // 若为空字符串 在此处提供root路径 currentPath 在每次迭代中，顺序为 /1 /1/2 /1/2/3
      const currentPath = current ? `${previous || ""}/${current}` : "/";
      let finedConfig;
      if (configs && configs.length) {
        // 寻找能匹配命中当前路径的配置
        finedConfig = configs.find(config => {
          return !!matchPath(currentPath, {
            path: config.path,
            exact: true
          });
        });
      }
      // 不用再次提供根路径
      const pathIgnoreRoot = currentPath === "/" ? "" : currentPath;
      // 若配置为“排除”,则不加入breadcrumbs数组
      if (finedConfig && finedConfig.exclude) {
        return pathIgnoreRoot;
      }
      breadcrumbs.push({
        url: currentPath,
        // 配置提供了命名
        name: (finedConfig && finedConfig.name) || current || "/"
      });
      return pathIgnoreRoot;
    }, null);
  return breadcrumbs;
}
export default (configs?: config[]) => Component => {
  return props => {
    const currentLocation = useLocation();
    // 根据当前的location获取各个segements作为breadcrumbs数组
    const breadcrumbs = getSegments(currentLocation.pathname, configs);
    return <Component {...props} breadcrumbs={breadcrumbs} />;
  };
};
