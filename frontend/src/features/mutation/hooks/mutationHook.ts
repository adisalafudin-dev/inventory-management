import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MutationHistoryQueryParams } from "../types";
import { mutationService } from "../services/mutationService";

export function useMutationHistory(params: MutationHistoryQueryParams) {
  return useQuery({
    queryKey: ["log-mutasi", params],
    queryFn: () => mutationService.getHistory(params),
    placeholderData: keepPreviousData,
  });
}

export function useItemMutationHistory(
  itemId: string,
  params: MutationHistoryQueryParams,
) {
  return useQuery({
    queryKey: ["log-mutasi", itemId, params],
    queryFn: () => mutationService.getItemHistory(itemId, params),
    enabled: Boolean(itemId),
    placeholderData: keepPreviousData,
  });
}
