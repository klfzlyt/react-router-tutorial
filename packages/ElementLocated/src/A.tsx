import * as React from 'react';
import { ElementLocated } from './LocateElement';
export default function(props) {
  const array = Array.from({ length: 100 });
  const [shouldChild, setChild] = React.useState(false);
  // 模拟异步
  !shouldChild &&
    setTimeout(() => {
      setChild(true);
    }, 1000);
  // 使用ElementLocated
  return (
    <ElementLocated>
      {!shouldChild && <div>Loading……………………</div>}
      <ul style={{height:'150px',overflow:'scroll'}}>
        {shouldChild &&
          array.map((v, i) => {
            return (
              <li key={i} id={`${i}`}>
                {i}
              </li>
            );
          })}
      </ul>
    </ElementLocated>
  );
}
