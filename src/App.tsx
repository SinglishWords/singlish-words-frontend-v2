import { useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";

import { ReactQueryDevtools } from "react-query/devtools";
import { AppRoutes } from "src/routes/app.routes";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <SnackbarProvider
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      preventDuplicate={true}
      autoHideDuration={10000}
      maxSnack={1}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {useRoutes(AppRoutes)}
      </QueryClientProvider>
    </SnackbarProvider>
  );
};
