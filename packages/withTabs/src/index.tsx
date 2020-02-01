import React from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import { useEffect, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import queryString from "query-string";
import { __RouterContext } from "react-router";
import { BrowserRouter } from "react-router-dom";
const { TabPane } = Tabs;
export const useQuery = () => {
  const location = React.useContext(__RouterContext).location;
  const { search } = location;
  const query = useMemo(() => queryString.parse(search), [search]);
 
  return query;
};
export const useUpdateQuery = options => {
  const { history } = React.useContext(__RouterContext);
  const query = useQuery();
  const { replace } = options;
  const updateQuery = useCallback(
    updateQuery => {
      const newQuery = { ...query, ...updateQuery };
      const newSearch = queryString.stringify(newQuery);
      if (replace) {
        history.replace({ search: newSearch });
      } else {
        history.push({ search: newSearch });
      }
    },
    [history, query, replace]
  );
  return updateQuery;
};

// Tabs高阶组件
function withRouterTabs(Tabs) {
  return props => {
    const originOnChange = props.onChange;
    const updateUrlQuery = useUpdateQuery({ replace: true });
    const search = useQuery();
    const queryKey = props.queryKey || "_tabKey";
    const tabkey = search && search[queryKey];
    const onChange = useCallback(
      (...args) => {
        originOnChange && originOnChange(...args);
        const key = args[0];
        args && key && props.linkUri && updateUrlQuery({ [queryKey]: key });
      },
      [originOnChange, updateUrlQuery, queryKey, props.linkUri]
    );
    useEffect(() => {
      !tabkey && onChange(props.defaultActiveKey);
    }, []);
    return (
      <Tabs
        {...props}
        onChange={onChange}
        activeKey={tabkey || props.defaultActiveKey || props.activeKey}
      >
        {props.children}
      </Tabs>
    );
  };
}

const RouterTabs = withRouterTabs(Tabs);
ReactDOM.render(
  <BrowserRouter>
    <RouterTabs queryKey="tab" linkUri defaultActiveKey="1">
      <TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </TabPane>
    </RouterTabs>
  </BrowserRouter>,
  document.getElementById("root")
);
