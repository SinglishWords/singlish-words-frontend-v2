import { useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { AppRoutes } from "src/routes/app.routes";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {useRoutes(AppRoutes)}
    </QueryClientProvider>
  );
};
