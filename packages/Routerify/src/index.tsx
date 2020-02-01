

import * as React from "react";
import { render } from "react-dom";
import {Switch} from 'react-router';
import { createBrowserHistory } from "history";
import RouteProvider from "./RouteProvider";
import A from "./A";
import B from "./B";
import { Redirect,Link } from "react-router-dom";
const history = createBrowserHistory();
function App() {
  return (
    <div className="App">
      <RouteProvider history={history}>
        <div>
          <Switch>
            <Redirect exact from="/" to="/a"/>
          </Switch>
          <Link to="/b">to b</Link>
          <A path="/a" />
          <B path="/b" />
        </div>    
      </RouteProvider>
    </div>
  );
}
// const routes = [
//   {
//     component: 1,
//     routes: [
//       {
//         path: "/user",
//         component: 2
//       },
//       {
//         path: "/user/info",
//         component: 3,
//         routes: [
//           {
//             path: "/user/info/:id",
//             component: 4
//           }
//         ]
//       }
//     ]
//   }
// ];
// const branch = matchRoutes(routes, "/user/info");
// console.log("branch", branch);
const rootElement = document.getElementById("root");
render(<App />, rootElement);
/*
  link 不能带hash的
*/

/*
对于react router v3 有IndexRedirect，IndexRoute，他们的作用是可渲染父级路由下额外的路由组件
在react router升级到v4之后，这个接口就被取消了，用新的api也很好实现
```js
interface RoutePropsExt extends RouteProps {
  indexComponent?: React.ReactNode;
  indexRedirect?: string;
}
export default function(props: RoutePropsExt) {
  const { component: Component, indexRedirect } = props;
  return (
    <Route
      {...omit(props, ["component", "children"])}
      isExact={false}
      render={renderProps => {  
        return (
          <>
            {indexRedirect && renderProps.match.isExact && (
              <Redirect
                to={`${processPath(props.path, true)}/${processPath(
                  indexRedirect
                )}`}
              />
            )}
            <Component {...renderProps}>{props.children}</Component>
          </>
        );
      }}
    />
  );
}
````
实现上 读取component用作自身渲染，并且isExact为false，方便子路由的渲染，如果isExact为true，将仅有完全匹配才能渲染，如/home将无法完全匹配/，因而/home将不会父路由/所需要的组件，封装Route将得不到渲染，与父子路由设计出现出入。之后再利用renderProps.match.isExact
用来判断是否完全匹配中了当前的路由，如果完全匹配成功并且传入了indexRedirect，可以实例化一个Redirect组件，用于重定向到具体的路径
重定向路径要带上props.path，拼合后的Redirect路径to为props.path+indexRedirect ，由于有了props.path部分，这样保证了当前的封装Route一定得到渲染，因而才能渲染props.children子路由。
封装后的RouteRedirect用法如下：

*/
