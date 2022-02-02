import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import user from "../services/userService";

const VerifyUser = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const emailToken = searchParams.get("emailToken");

  useEffect(() => {
    user.verifyUser(emailToken);
    window.location = "/";
  }, []);

  return null;
};

export default VerifyUser;
