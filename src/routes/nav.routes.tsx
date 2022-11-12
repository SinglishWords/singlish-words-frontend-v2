import { RouteObject } from "react-router-dom";

import { ExplorePage } from "src/pages/ExplorePage";
import { HomePage } from "src/pages/HomePage";
import { VisualisePage } from "src/pages/VisualisePage";

type NavigationRouteObject = RouteObject & {
  label: string;
  path: string;
  children?: NavigationRouteObject[];
};

export const routes = [
  {
    path: "",
    element: <HomePage />,
    label: "HOME",
  },
  {
    path: "explore",
    element: <ExplorePage />,
    label: "EXPLORE",
  },
  {
    path: "visualise",
    element: <VisualisePage />,
    label: "VISUALISE",
  },
];

export const NavigationBarRoutes: NavigationRouteObject[] = [...routes];
