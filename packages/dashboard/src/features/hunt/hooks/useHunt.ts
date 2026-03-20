import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { api } from "@lootopia/dashboard/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddHunt = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, HuntFormValues>({
    mutationFn: (data) => api.hunts.$post({ json: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hunts"] })
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
