import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/userService";

const Logout = () => {
  const navigate = useNavigate();

  authService.logout();

  useEffect(() => {
    navigate("/login");
  }, []);

  return null;
};

export default Logout;
