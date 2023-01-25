import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import qs from 'query-string';
import { setting } from '../setting';
import { addMessageToToast } from '../toast';

export const getHttpHeaders = (): AxiosRequestConfig => {
  //##@taken token from localstorage
  const token = localStorage.getItem(setting.storage.token);

  //const token = auth?.token;

  if (token) {
    return {
      headers: {
        Accept: 'application/json',
        'x-access-token': token || '',
      },
    };
  }
  return {};
};

export const get = <T = any>(
  path: string,
  params?: {
    [key: string]: string | number | Date | CancelToken | any;
  }
): Promise<AxiosResponse<T>> =>
  axios
    .get(path, {
      params,
      ...getHttpHeaders(),
      paramsSerializer: (params) => {
        const _params = {};
        Object.keys(params).forEach((key) => {
          if (params[key] instanceof Date) {
            _params[key] = params[key].toISOString();
          } else {
            _params[key] = JSON.stringify(params[key]);
          }
        });
        return qs.stringify(_params, { encode: false });
      },
    })
    .catch(detectError);

// const uploadFile = (path: string, data: FormData): Promise<AxiosResponse> =>
//   axios
//     .post(path, data, {
//       ...getHttpHeaders('multipart/form-data'),
//     })
//     .catch(detectError);

export const del = (path: string): Promise<AxiosResponse> =>
  axios.delete(path, getHttpHeaders()).catch(detectError);

export const post = <T = any>(
  path: string,
  data: any,
  showError = true
): Promise<AxiosResponse<T>> =>
  axios
    .post(path, data, getHttpHeaders())
    .catch((error) => (showError ? detectError(error) : Promise.reject(error)));

export const put = <T = any, D = any>(path: string, data?: D): Promise<AxiosResponse<T, D>> =>
  axios.put(path, data, getHttpHeaders()).catch(detectError);

export const patch = (path: string, data: any): Promise<AxiosResponse> =>
  axios.patch(path, data, getHttpHeaders()).catch(detectError);

export const httpGetAll = <T = any>(
  path: string,
  options: {
    filter?: any;
    sort?: any;
    populate?: any;
    page?: number;
    perPage?: number;
    delivery?: string[];
  } = {}
): Promise<AxiosResponse<PaginatedResponseType<T>>> => {
  const { filter = {}, sort = {}, populate = [], page = 0, perPage = 20, delivery } = options;
  return get<PaginatedResponseType<T>>(path, {
    _filters: filter,
    _sort: sort,
    _populates: populate,
    _page: page,
    _perPage: perPage,
    _delivery: delivery,
  });
};

const detectError = (error: AxiosError<any>): Promise<AxiosResponse> => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
  }

  let str = 'Se produjo un error inesperado. Intenta mas tarde o contacta con soporte';
  if (error.response?.status === 400) {
    str = error.response.data;
  }

  addMessageToToast(str, {
    status: 'error',
    icon: 'alert-triangle',
  });
  return Promise.reject(error);
};
