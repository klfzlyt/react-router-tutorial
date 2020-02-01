import * as React from "react";
export default function(props) {
  const array = Array.from({ length: 100 });

  return (
    <ul style={{  overflow: "auto" }}>
      {array.map((v, i) => {
        return (
          <li key={i} id={`${i}`}>
            {i}
          </li>
        );
      })}
    </ul>
  );
}
