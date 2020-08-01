import { RouteComponentProps } from "react-router";
import * as React from "react";
import { getDishDetailService } from "../services/index";
export default function DishDetail(props: RouteComponentProps) {
  const [dish, setDish] = React.useState(null);
  React.useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    getDishDetailService(query.get("dishId")).then(dish => {
      setDish(dish);
    });
  }, []);
  return (
    dish && (
      <>
        <div className="dish">
          <img className="dish-img" src={dish.img} />
          <div>菜品名：{dish.name}</div>
          <div>推荐数：{dish.recommends}</div>
          <div>评分：{dish.rate}</div>
          <div>评论：{dish.comments.join(" ")}</div>
        </div>
      </>
    )
  );
}
