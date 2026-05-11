import type { AppType } from "@lootopia/api/routes/route"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import {
  type UndefinedInitialDataOptions,
  type UseMutationOptions,
  useMutation as useReactMutation,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import {
  type ClientRequestOptions,
  type ClientResponse,
  hc,
  type InferRequestType,
  type InferResponseType,
} from "hono/client"

export type HonoClientFunction =
  | ((
      _args: any,
      _options?: ClientRequestOptions,
    ) => Promise<ClientResponse<any, number, "json">>)
  | ((
      _args?: {},
      _options?: ClientRequestOptions,
    ) => Promise<ClientResponse<any, number, "json">>)

export const api = hc<AppType>(`${window.location.origin}/api`, {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await fetch(input, { ...init, credentials: "include" })

    if (res.ok) {
      return res
    }

    if (res.status === 401) {
      window.location.href = "/signin"

      return res
    }

    const { error } = (await res.json()) as { error: string }

    throw new Error(error)
  },
})

type OkResponse<T> = Exclude<T, { error: unknown }>

type QueryRequest = { $get: HonoClientFunction; $url: (_args?: any) => URL }

export const getQueryKey = <TRequest extends QueryRequest>(
  request: TRequest,
  queryArgs?: InferRequestType<TRequest["$get"]>,
) => [request.$url().toString(), JSON.stringify(queryArgs)]

export const useQuery = <TRequest extends QueryRequest>(
  request: TRequest,
  queryArgs?: Omit<
    UndefinedInitialDataOptions<
      OkResponse<InferResponseType<TRequest["$get"]>>,
      Error
    >,
    "queryKey" | "queryFn"
  > &
    InferRequestType<TRequest["$get"]>,
) => {
  const queryKey = getQueryKey(request, queryArgs)

  return {
    ...useReactQuery<OkResponse<InferResponseType<TRequest["$get"]>>, Error>({
      queryKey,
      queryFn: async () => {
        const res = await request.$get(queryArgs)

        return res.json() as Promise<
          OkResponse<InferResponseType<TRequest["$get"]>>
        >
      },
      ...queryArgs,
    }),
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
  }
}

export const useMutation = <TRequest extends HonoClientFunction>(
  request: TRequest,
  mutationArgs?: Omit<
    UseMutationOptions<
      OkResponse<InferResponseType<TRequest>>,
      Error,
      InferRequestType<TRequest>
    >,
    "mutationFn"
  >,
) => {
  const { mutateAsync, ...rest } = useReactMutation({
    mutationFn: async (variables) => {
      const res = await request(variables)

      return res.json() as Promise<OkResponse<InferResponseType<TRequest>>>
    },
    ...mutationArgs,
  })

  return [mutateAsync, rest] as const
}
