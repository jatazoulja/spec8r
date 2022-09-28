import { createBrowserRouter } from "react-router-dom";
import DashboardController from "#ui-screens/Dashboard/DashboardController";
import ServerController from "#ui-screens/Servers/ServersController";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardController />,
    children: [
      {
        path: "/",
        element: <ServerController />,
      },
      {
        path: "/collection/:collectionId",
        element: <ServerController />,
      },
    ],
  },
]);

export default Routes;
