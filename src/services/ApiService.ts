import axios, { AxiosError, AxiosResponse } from "axios";

// const API_BASE_URL = "http://localhost:8080/";
const API_BASE_URL = "https://singlishwords.nus.edu.sg/api/v1/";

const getApiErrorMessage = (error: unknown): ApiResponseError => {
  const defaultError = {
    message: `Something went wrong. Please contact the project team at singlishwords@nus.edu.sg.`,
  };

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return defaultError;
    }

    const response = error.response as AxiosResponse<
      { message: string } | undefined
    >;

    if (response?.data?.message) {
      return { message: response.data.message, status: response.status };
    }

    if (response?.statusText) {
      return { message: response.statusText, status: response.status };
    }

    return defaultError;
  }

  if (error instanceof Error) {
    return { message: error.message } ?? defaultError;
  }

  return defaultError;
};

// We use Pascal case here since this acts as a singleton in the application.
export const ApiService = axios.create({
  baseURL: API_BASE_URL,
});

export type ApiResponseError = {
  message: string;
  status?: number;
};

ApiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const transformedError = getApiErrorMessage(error);
    throw transformedError;
  }
);


// New function to fetch data from /answers endpoint
export const fetchAllAnswers = async () => {
  try {
    const response = await ApiService.get("/answers");
    return response.data;
  } catch (error) {
    throw getApiErrorMessage(error);
  }
};