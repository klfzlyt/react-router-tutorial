import * as React from "react";
import { RouteChildrenProps } from "react-router";
import ScrollElement from "./scroll/scroll-element";
export default function(props: RouteChildrenProps) {
  const bigArray = Array.from({ length: 1000 }).map((v, k) => k);
  return (
    <>
      <div>
        长列表1 外层display:none不销毁 内部组件列表销毁重建（ul的key变化）
      </div>
      {/* 用来记录位置 scrollKey必须 作为缓存key when不传的话（为undefined），会进行滚动恢复，传了when，when为true才会进行滚动恢复 */}
      <ScrollElement
        when={bigArray.length > 0}
        scrollKey="我下面的ul要保存住滚动位置,即便key会变(remount)"
      >
        <ul
          key={Math.random() /* 列表销毁重建！ */}
          style={{ maxHeight: 400, overflow: "auto" }}
        >
          {bigArray.map(i => {
            return (
              <div style={{ marginBottom: 10 }} key={i}>
                <span
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
