import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import useHookRoutes from "../hook-route";
import poiDetail from "./poiDetail";
const routes = {
  "/detail": poiDetail
};
export default function(props: RouteComponentProps) {
  const detail = useHookRoutes(routes);
  React.useEffect(() => {
    /* ………… */
  }, []);

  return (
    <>
      <div className="pois" />
      {<div>门店</div>}
      <Link to="/list/detail">详情</Link>
      {detail}
    </>
  );
}
