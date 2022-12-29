import { useQuery } from "react-query";
import { useSnackbar } from "notistack";

import { QUERY_KEYS } from "src/constants/query-keys";
import { ApiService } from "src/services/ApiService";
import { ApiResponseError } from "src/services/ApiService";

export const useDownloadForwardAssociation = (word: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const getDownloadForwardAssociation = async () => {
    try {
      const { data } = await ApiService.get(
        `/associations/forward/${word}/download`
      );
      enqueueSnackbar("Forward associations downloaded. ", {
        variant: "success",
      });
      return data;
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to download forward association. " +
          (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const {
    data: downloadForwardAssociation,
    isLoading: isDownloadForwardAssociationLoading,
    refetch: refetchDownloadForwardAssociation,
  } = useQuery(
    [QUERY_KEYS.DOWNLOAD_FORWARD_ASSOCIATION, word || ""],
    getDownloadForwardAssociation,
    { enabled: false }
  );
  return {
    downloadForwardAssociation,
    isDownloadForwardAssociationLoading,
    refetchDownloadForwardAssociation,
  };
};

export const useDownloadBackwardAssociation = (word: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const getDownloadBackwardAssociation = async () => {
    try {
      const { data } = await ApiService.get(
        `/associations/backward/${word}/download`
      );
      enqueueSnackbar("Backward associations downloaded. ", {
        variant: "success",
      });
      return data;
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to download backward associations. " +
          (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const {
    data: downloadBackwardAssociation,
    isLoading: isBackwardAssociationLoading,
    refetch: refetchDownloadBackwardAssociation,
  } = useQuery(
    [QUERY_KEYS.DOWNLOAD_BACKWARD_ASSOCIATION, word || ""],
    getDownloadBackwardAssociation,
    { enabled: false }
  );
  return {
    downloadBackwardAssociation,
    isBackwardAssociationLoading,
    refetchDownloadBackwardAssociation,
  };
};
