// lib/apiRequest.ts
import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";
import { axiosInstance } from "./axiosInstance";

export type ApiRequestArgs<T> = {
  method: Method;
  url: string;
  data?: T;
  config?: AxiosRequestConfig;
};

export type ApiRequestReturnType<T> = Promise<T | undefined>;

export async function apiRequest<TResponse = unknown, TRequest = unknown>(
  args: ApiRequestArgs<TRequest>
): ApiRequestReturnType<TResponse> {
  const { method, url, data, config = {} } = args;

  const finalConfig: AxiosRequestConfig = {
    ...config,
    method,
    url: `api/v1${url}`,
    data,
  };

  try {
    const response: AxiosResponse<TResponse> = await axiosInstance.request(
      finalConfig
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
      console.log(`[API Cancelled] ${method?.toUpperCase()} ${url}`);
    } else {
      console.error(`[API Error] ${method?.toUpperCase()} ${url}`, error);
      throw error;
    }
  }
}

// Optional: cancellable version
// export const createCancellableRequest = <
//   TResponse = unknown,
//   TRequest = unknown,
// >(): [
//   (args: ApiRequestArgs<TRequest>) => ApiRequestReturnType<TResponse>,
//   () => void,
// ] => {
//   const controller = new AbortController();

//   const request = (args: ApiRequestArgs<TRequest>) =>
//     apiRequest<TResponse, TRequest>({
//       ...args,
//       config: { ...args.config, signal: controller.signal },
//     });

//   return [request, () => controller.abort()];
// };
