import * as React from "react";
import { RouteChildrenProps } from "react-router";
import ScrollElement from "./scroll/scroll-element";
export default function(props: RouteChildrenProps) {
  const [data, setData] = React.useState(0);
  const bigArray = Array.from({ length: data }).map((v, k) => k);
  setTimeout(() => {
    setData(2000);
  }, 1500);
  return (
    <>
      <div>长列表4 渲染后 拉取数据（1.5s数据返回）</div>
      {/* 用来记录位置 scrollKey必须 作为缓存key when不传的话（为undefined），会进行滚动恢复，传了when，when为true才会进行滚动恢复 */}
      <ScrollElement when={bigArray.length > 0} scrollKey="渲染后 拉取数据">
        <ul style={{ maxHeight: 400, overflow: "auto" }}>
          {bigArray.map(i => {
            return (
              <div style={{ margin: 10 }} key={i}>
                <span
                  style={{ margin: 10 }}
                  onClick={() => {
                    props.history.push("/detail");
                  }}
                >
                  {i}--点我导航到detail
                </span>
              </div>
            );
          })}
        </ul>
      </ScrollElement>
    </>
  );
}
