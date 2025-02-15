import { useRoutes } from "react-router";
import { routeConfig } from "./route-config";

const AppRoutes = () => {
  const element = useRoutes(routeConfig);

  return <div>{element}</div>;
};

export default AppRoutes;
