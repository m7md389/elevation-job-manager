import React from "react";
import { Navigate } from "react-router-dom";
import auth from "../../services/authService";
import ForbiddenPage from "./../ForbiddenPage";

const ProtectedRoute = ({ children, isAdminPage, isStudentPage }) => {
  const user = !!auth.getCurrentUser();
  const isAuthenticated = user;

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (isAdminPage && auth.getCurrentUser().role !== "admin") ||
    (isStudentPage && auth.getCurrentUser().role !== "student") ? (
    <ForbiddenPage />
  ) : (
    children
  );
};

export default ProtectedRoute;
