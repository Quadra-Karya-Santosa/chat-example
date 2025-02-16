import { RootState } from '../_store';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { deleteTokenAuth } from '../_store/auth';

export interface ApiResponseI<T> {
  data: T;
}

export interface ApiErrorResponseI {
  message: string;
  statusCode: number;
}

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_REST_HOST,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (import.meta.env.VITE_ENV === "development") {
    console.info('[RTK Api fetch]:', args);
  }
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    if (result.error.status === 401) {
      api.dispatch(deleteTokenAuth());
    }
  }
  if (import.meta.env.VITE_ENV === "development") {
    console.info('[RTK Api result]:', result);
  }
  return result;
};

export const Api = createApi({
  baseQuery: baseQueryWithInterceptor,
  reducerPath: "api",
  tagTypes: [],
  endpoints: () => ({}),
});
