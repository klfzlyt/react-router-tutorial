import * as React from "react";

import RouteProvider from "./RouteProvider";
import { Link } from "react-router-dom";
function C(props) {
  return <>C组件</>;
}
export default function(props) {
  const array = Array.from({ length: 100 });

  return (
    <RouteProvider>
      <span>
      
      </span>
      <ul style={{ height: "200px",overflow: "auto" }}>
        {array.map((v, i) => {
          return (
            <li key={i} id={`${i}`}>
              <Link to="/a/c">{i}-show C组件</Link>
            </li>
          );
        })}
      </ul>
      <C path="/c" />
    </RouteProvider>
  );
}
