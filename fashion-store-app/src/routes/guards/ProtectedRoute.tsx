import { Outlet } from "react-router";
import { useGlobalContext } from "../../GlobalContext";
import LoadingSpinner from "@components/LoadingSpinner";
import Login from "@views/Login/index";

const ProtectedRoute = () => {
  const { token, isLoading } = useGlobalContext();

  if (isLoading || !token) {
    return <LoadingSpinner />;
  }

  return token ? <Outlet /> : <Login />;
};

export default ProtectedRoute;
