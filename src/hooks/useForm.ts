import { useMutation } from "react-query";
import { useSnackbar } from "notistack";

import { Form } from "src/types/state/form.dto";
import { ApiService } from "src/services/ApiService";
import { ApiResponseError } from "src/services/ApiService";

export const useSubmitForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const submitForm = async (input: Form) => {
    try {
      await ApiService.post<void>(`/answers`, input);
      enqueueSnackbar("Your responses have been submitted", {
        variant: "success",
      });
    } catch (e: unknown) {
      enqueueSnackbar(
        "Unable to submit responses. " + (e as ApiResponseError).message,
        {
          variant: "error",
        }
      );
    }
  };
  const { isLoading: isSubmitFormLoading, mutateAsync: submitFormMutation } =
    useMutation(submitForm);
  return {
    submitForm: submitFormMutation,
    isSubmitFormLoading,
  };
};
