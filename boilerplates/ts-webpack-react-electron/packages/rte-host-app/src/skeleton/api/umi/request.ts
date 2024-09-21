/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import { extend } from 'umi-request';

import { history } from '@/skeleton/env/history';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误），请重新登录',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = async (error: {
  response: Response;
}): Promise<Response> => {
  const { response } = error;

  try {
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status } = response;
      const resp = await response.clone().json();

      if (resp.status === 'error' && resp.err) {
        notification.error({
          message: `请求错误 ${status}`,
          description: resp.err.reason || resp.err.code,
        });
      } else {
        notification.error({
          message: `请求错误 ${status}`,
          description: errorText,
        });
      }
      // 如果是 401，则跳转到登录
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      if (response.status === 401) {
        history.push('/auth/login');
      }
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
  } catch (ie) {
    notification.error({
      description: '响应数据异常',
      message: '服务器异常',
    });
  }

  return response;
};

/** 配置 request 请求时的默认参数 */
export let umiRequest = extend({
  errorHandler, // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie
});

/** 动态设置请求头 */
export function setRequestHeader(headers: Record<string, string>) {
  umiRequest = extend({
    errorHandler, // 默认错误处理
    headers,
    credentials: 'same-origin', // 默认请求是否带上cookie
  });
}
