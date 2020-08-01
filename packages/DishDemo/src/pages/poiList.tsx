import { RouteComponentProps } from "react-router";
import * as React from "react";
import { Link } from "react-router-dom";
import { getPoiList } from "../services/index";
export default function(props: RouteComponentProps) {
  const [poiList, setPoiList] = React.useState([]);
  React.useEffect(() => {
    getPoiList().then(poiList => {
      setPoiList(poiList);
    });
  }, []);
  return (
    <>
      <div>推荐商家</div>
      <div className="pois">
        {poiList.map((poi, index) => {
          return (
            <Link to={`/poi-detail?id=${poi.shopId}`} key={index}>
              <img src={poi.newImgUrl} />
              <div>{poi.shopName}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
