import { RouteComponentProps } from "react-router";
import * as React from "react";
import { getPoiDetail } from "../services/index";
export default function PoiDetail(props: RouteComponentProps) {
  const [poiInfo, setPoiInfo] = React.useState(null);
  React.useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    getPoiDetail(query.get("id")).then(poiInfo => {
      setPoiInfo(poiInfo);
    });
  }, []);
  return (
    poiInfo && (
      <>
        <div>商家详情</div>
        <div>地址：{poiInfo.address}</div>
        <div>电话：{poiInfo.phone}</div>
        <div>人均：{poiInfo.average}元</div>
        <div className="dishes">
          {poiInfo.dishes.map((dish, index) => {
            return (
              <div
                onClick={() => {
                  props.history.push(`/dish-detail?dishId=${dish.id}`);
                }}
                key={index}
              >
                <img className="dish-pic" src={dish.frontImgUrl} />
                <div>{dish.name}</div>
                <div>{dish.price}元</div>
              </div>
            );
          })}
        </div>
      </>
    )
  );
}
