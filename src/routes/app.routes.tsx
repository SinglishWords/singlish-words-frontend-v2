import { RouteObject } from "react-router-dom";

import { TopbarLayout } from "src/layouts/TopbarLayout";
import { NavigationBarRoutes } from "src/routes/nav.routes";
import { FormPage } from "src/pages/FormPage";

export const AppRoutes: RouteObject[] = [
  {
    children: [
      {
        path: "",
        element: <TopbarLayout />,
        children: NavigationBarRoutes,
      },
      {
        path: "/form",
        element: <FormPage />,
      },
    ],
  },
];
