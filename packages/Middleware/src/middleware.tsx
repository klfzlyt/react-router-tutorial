import { History, Location } from 'history';
import * as _ from 'lodash';
import {message} from 'antd';
import 'antd/lib/style/css';
interface MiddlewareState {
  history?: History;
  method?: 'push' | 'replace' | 'go' | 'goBack' | 'goForward';
  from?: Location;
  to?: Location | string | number;
  originParams?: any[];
}

export interface redirectLocationDescriptorObject extends Location {
  push?: boolean;
}
type Middleware = (
  next: (redirect?: (Location & { push?: boolean }) | string) => void,
  state?: MiddlewareState,
) => void;

// 提供重定向
async function redirectTo(
  history: History,
  redirect: redirectLocationDescriptorObject | string,
) {
  let historyMehod = history.replace;
  let path: string;
  let state;
  if (typeof redirect !== 'string') {
    state = redirect.state;
    path = history.createHref(redirect);
    if (redirect.push) {
      historyMehod = history.push;
    }
  } else {
    path = redirect;
  }
  return historyMehod(path, state);
}

export default function applyMiddleware(
  history: History,
  middwares: Middleware[],
) {
  const methods = ['push', 'replace', 'go', 'goBack', 'goForward'];

  // 用以保存原始的导航方法
  const originHistoryMethods = {};
  methods.forEach((method) => {
    originHistoryMethods[method] = history[method];
  });
  let loading = false;
  // 对methods每一个方法都重写
  methods.forEach((method) => {
    history[method] = async function(...args: any[]) {
      if (loading) {
        // 如果异步中间还未返回，则不进行导航操作
        return;
      }
      // 最后的一个next中间件
      let next = async (
        redirect?: redirectLocationDescriptorObject | string,
      ) => {
        console.log('最后一个中间件');
        if (redirect) {
          loading = false;
          await redirectTo(history, redirect);
          // 返回 不执行真正的history方法
          return;
        }
        loading = false;
        // 将真正的history等方法放在最后一个中间件内执行，原有参数透传到方法参数列表中
        await originHistoryMethods[method](...args);
      };
      // 当前的history.location即为from的值
      const from = history.location;
      const to = args[0];
      // 是从右到左遍历集合中每一个元素的，从右到左依次更新next函数，每一个函数的next由
      // 上一个middwate进行bind获得
      // 除了next 之外，依次将history,当前方法method,当前起始from,目标路径参数的第一个，以及整个调用方法的参数数组封装成对象传递给函数
      _.forEachRight(middwares, (middware) => {
        // next得到无参数直接调用函数
        const fn = middware.bind(undefined, next, {
          history,
          method,
          from,
          to,
          args,
        });
        // 为next函数包裹外层参数
        next = async (redirect?: redirectLocationDescriptorObject | string) => {
          // 这里类似vue-rotuer，根据参数进行重定向跳转等等
          if (redirect) {
            loading = false;
            // 重新开始
            await redirectTo(history, redirect);
            // 返回 不执行真实的next函数
            return;
          }
          loading = true;
          // 真正的next函数
          await fn();
          loading = false;
        };
      });
      // 也可在此处加入 view loading组件
      await next();
    };
  });
}
// 设计为调用next或者不调用next next不接受任何参数，如果希望跳转到其他路径，
// 可以调用history.push history.replace等进行跳转
//当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。

// 调用next表明进行下一个中间件，与redux类似
// 中间件写法1
export async function middware1(next, { history, method, from, to, args }) {
  // next分别为下一个异步中间件，history对象，method表明对应的history方法，有push，replace，go，goBack，goForward，from表示跳转的起始路径，
  // to表示跳转的到达路径，可能为Location描述对象，字符串，undefined等，
  // args表明history各方法的参数数组，可在中间件中灵活使用，args记录了所有的history方法的
  // 参数
  console.log('第一个中间件', history, method, from, to, args);

  // 拦截 /list-B的导航
  // 如果希望中间件不进行拦截，则不用调用 next
  await next();
}
// 中间件写法2
export async function middware2(next, state) {
  console.log('第二个中间件');
  const { to } = state;

  if (to === '/c') {  
    message.loading('加载中',5000)  
    // 支持异步
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 600);
    });
    message.destroy();
  }
  await next();
}
let globalLogin = true;
// 如果未登录，且导航不是登录页，则重新导航到登录页
export async function middware3(next, state) {
  console.log('第三个中间件');
  const { to } = state;

  if (to !== '/login' && !globalLogin) {
    console.log('未登录，将导航到登录页');
    // 重新到登录页
    await next('/login');
  } else {
    await next();
  }
}
