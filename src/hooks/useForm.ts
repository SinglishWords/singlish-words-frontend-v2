import { useMutation } from "react-query";
import { useSnackbar } from "notistack";

import { Form } from "src/types/state/form.dto";
import { ApiService } from "src/services/ApiService";
import { ApiResponseError } from "src/services/ApiService";

export const useSubmitForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation(
    async (input: Form) => {
      await ApiService.post<void>("/answers", input);
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Your responses have been submitted.", {
          variant: "success",
        });
      },
      onError: (error: unknown) => {
        enqueueSnackbar(
          "Unable to submit responses. " +
          (error as ApiResponseError).message,
          { variant: "error" }
        );
      },
    }
  );

  return {
    submitForm: mutation.mutateAsync,
    isSubmitFormLoading: mutation.isLoading,
  };
};
