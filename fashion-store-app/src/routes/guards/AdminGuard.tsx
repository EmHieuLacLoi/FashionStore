// src/routes/guards/AdminGuard.tsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { getToken } from "@utils/auth";
import LoadingSpinner from "@components/LoadingSpinner";
import { getUserInfo } from "@services/AuthService";

const AdminGuard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserInfo();

        if (response.data && response.data.role === "ROLE_ADMIN") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminGuard;
