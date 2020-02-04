import * as React from "react";

export default function Remount(props) {
  // 初始化key
  const keyRef = React.useRef(Math.random() + Date.now());

  if (props.shouldRemountComponent) {
    // 更新key
    keyRef.current = Math.random() + Date.now();
  }
  return React.cloneElement(React.Children.only(props.children), {
    key: keyRef.current
  });
}
