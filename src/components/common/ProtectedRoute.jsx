import React from "react";
import { Navigate } from "react-router-dom";

import auth from "../../services/authService";
import ForbiddenPage from "./../ForbiddenPage";
import VerifyAccount from "./../VerifyAccount";

const ProtectedRoute = ({ children, isAdminPage, isStudentPage }) => {
  const user = auth.getCurrentUser();
  const isAuthenticated = !!user;

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  if (user.role !== "admin" && !user.isVerified) return <VerifyAccount />;

  return (isAdminPage && user.role !== "admin") ||
    (isStudentPage && user.role !== "student") ? (
    <ForbiddenPage />
  ) : (
    children
  );
};

export default ProtectedRoute;
