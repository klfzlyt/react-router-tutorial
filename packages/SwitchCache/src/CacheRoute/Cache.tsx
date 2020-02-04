import * as React from "react";
import { RouteChildrenProps } from "react-router";
interface Props extends RouteChildrenProps {
  children?: any;
}
function MemoChildrenWithRouteMatch(props: Props) {
  return props.children;
}
export default React.memo(MemoChildrenWithRouteMatch, (prvious, nextProps) => {
  return !nextProps.match;
});
function MemoChildrenWithRouteMatchExactFunction(props: Props) {
  return props.children;
}
export const MemoChildrenWithRouteMatchExact = React.memo(
  MemoChildrenWithRouteMatchExactFunction,
  (prvious, nextProps) => !(nextProps.match && nextProps.match.isExact)
);
