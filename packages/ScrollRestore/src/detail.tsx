import * as React from "react";
import { RouteChildrenProps } from "react-router";
export default function(props: RouteChildrenProps) {
  return (
    <div>
      detail
      <button onClick={() => props.history.goBack()}>返回（或者左上角）</button>
    </div>
  );
}
