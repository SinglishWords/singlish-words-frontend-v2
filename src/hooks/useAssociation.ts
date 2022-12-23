import { useQuery } from "react-query";
import { useSnackbar } from "notistack";

import { QUERY_KEYS } from "src/constants/query-keys";
import { ApiService } from "src/services/ApiService";
import { ApiResponseError } from "src/services/ApiService";
import { GetAssociationRes } from "src/types/api/association.dto";

export const useRandomAssociation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const getRandomAssociation = async () => {
    try {
      const { data } = await ApiService.get<GetAssociationRes | undefined>(
        `/associations/random/forward`
      );
      enqueueSnackbar("Random word retrieved. ", {
        variant: "success",
      });
      return data;
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to retrieve random forward associations. " +
          (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const {
    data: randomAssociation,
    isLoading: isRandomdAssociationLoading,
    refetch: refetchRandomWord,
  } = useQuery([QUERY_KEYS.RANDOM_FORWARD_ASSOCIATION], getRandomAssociation, {
    enabled: false,
  });
  return {
    randomAssociation,
    isRandomdAssociationLoading,
    refetchRandomWord,
  };
};

export const useForwardAssociation = (word: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const getForwardAssociation = async () => {
    try {
      const { data } = await ApiService.get<GetAssociationRes | undefined>(
        `/associations/forward/${word}`
      );
      enqueueSnackbar("Forward associations retrieved. ", {
        variant: "success",
      });
      return data;
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to retrieve forward association. " +
          (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const { data: forwardAssociation, isLoading: isForwardAssociationLoading } =
    useQuery(
      [QUERY_KEYS.FORWARD_ASSOCIATION, word || ""],
      getForwardAssociation,
      { enabled: !!word }
    );
  return {
    forwardAssociation,
    isForwardAssociationLoading,
  };
};

export const useBackwardAssociation = (word: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const getBackwardAssociation = async () => {
    try {
      const { data } = await ApiService.get<GetAssociationRes | undefined>(
        `/associations/backward/${word}`
      );
      enqueueSnackbar("Backward associations retrieved. ", {
        variant: "success",
      });
      return data;
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to retrieve backward association. " +
          (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const { data: backwardAssociation, isLoading: isBackwardAssociationLoading } =
    useQuery(
      [QUERY_KEYS.BACKWARD_ASSOCIATION, word || ""],
      getBackwardAssociation,
      { enabled: !!word }
    );
  return {
    backwardAssociation,
    isBackwardAssociationLoading,
  };
};
