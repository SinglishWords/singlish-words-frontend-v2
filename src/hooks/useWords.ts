import { useQuery } from "react-query";
import { useSnackbar } from "notistack";

import { QUERY_KEYS } from "src/constants/query-keys";
import { ApiService } from "src/services/ApiService";
import { ApiResponseError } from "src/services/ApiService";
import { GetWordsRes } from "src/types/api/words.dto";

export const useWords = (limit?: number) => {
  const { enqueueSnackbar } = useSnackbar();
  const getWords = async () => {
    try {
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
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to retrieve words. " + (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const {
    data: words,
    isLoading: isWordsLoading,
    refetch: refetchWords,
  } = useQuery([QUERY_KEYS.WORDS, limit?.toString() || ""], getWords, {
    enabled: false,
  });
  return {
    words,
    isWordsLoading,
    refetchWords,
  };
};
