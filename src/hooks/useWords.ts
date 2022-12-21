import { useQuery } from "react-query";

import { QUERY_KEYS } from "src/constants/query-keys";
import { ApiService } from "src/services/ApiService";

import { GetWordsRes } from "src/types/api/words.dto";

export const useWords = (limit?: number) => {
  const getWords = async () => {
    const { data } = await ApiService.get<GetWordsRes | undefined>(
      `/questions`,
      {
        params: {
          ...(limit && {
            limit: limit,
          }),
        },
      }
    );
    return data;
  };
  const { data: words, isLoading: isWordsLoading } = useQuery(
    [QUERY_KEYS.WORDS],
    getWords,
    // Prevents data from being marked as stale to avoid data refetching
    { staleTime: Infinity }
  );
  return {
    words,
    isWordsLoading,
  };
};
