import { RouteObject } from "react-router-dom";

import { TopbarLayout } from "src/layouts/TopbarLayout";
import { NavigationBarRoutes } from "src/routes/nav.routes";
import { EmailPage } from "src/pages/EmailPage";
import { InstructionPage } from "src/pages/InstructionPage";
import { QuizPage } from "src/pages/QuizPage";
import { UserDetailPage } from "src/pages/UserDetailPage";

export const AppRoutes: RouteObject[] = [
  {
    children: [
      {
        path: "",
        element: <TopbarLayout />,
        children: NavigationBarRoutes,
      },
      {
        path: "/userdetail",
        element: <UserDetailPage />,
      },
      {
        path: "/instruction",
        element: <InstructionPage />,
      },
      {
        path: "/quiz",
        element: <QuizPage />,
      },
      {
        path: "/email",
        element: <EmailPage />,
      },
    ],
  },
];
