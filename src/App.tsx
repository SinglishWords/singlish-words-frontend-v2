import { useRoutes } from "react-router-dom";

import { AppRoutes } from "src/routes/app.routes";

export const App = () => {
  return useRoutes(AppRoutes);
};
