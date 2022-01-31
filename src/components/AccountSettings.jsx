import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import http from "../services/httpService";
import auth from "../services/authService";
import { Input } from "@mui/material";
import Title from "./common/Title";

const AccountSettings = () => {
  const currentUser = auth.getCurrentUser();
  let userId = currentUser._id;
  let URL = "/users/";
  const [updatedDataInputs, setUpdatedDataInputs] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    status: ""
  });
  const [passwordChangeInput, setPasswordChangeInput] = useState({
    currentPassword: "",
    newPassword: ""
  });
  useEffect(() => {
    http.get(`${URL}${userId}`).then((res) => {
      let user = res.data;
      setUpdatedDataInputs({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        linkedin: user.linkedin,
        status: user.status
      });
    });
  }, []);
  const handleInputChange = (e, key) => {
    let tempUpdatedDataInputs = { ...updatedDataInputs };
    tempUpdatedDataInputs[key] = e.target.value;
    setUpdatedDataInputs(tempUpdatedDataInputs);
  };

  const handlePasswordInputChange = (event, inputName) => {
    let tempChangePasswordInputs = { ...passwordChangeInput };
    tempChangePasswordInputs[inputName] = event.target.value;
    setPasswordChangeInput(tempChangePasswordInputs);
  };

  const handleEditUser = () => {
    let tempUpdatedDataInputs = { ...updatedDataInputs };
    tempUpdatedDataInputs["userId"] = userId;
    http.put(`${URL}`, tempUpdatedDataInputs);
  };

  const handlePasswordChange = () => {
    let tempPasswordChangeInput = { ...passwordChangeInput };
    tempPasswordChangeInput["userId"] = userId;
    http.put(`${URL}password`, tempPasswordChangeInput).then((res) => {
      if (res.data.error) {
        alert("Current password not match the current password");
      }
    });
  };

  return (
    <div className="inputs-container">
      <Title text="Settings" />
      name:
      <Input
        id="nameInputs"
        onChange={(event) => handleInputChange(event, "name")}
        value={updatedDataInputs.name}
      />
      <br />
      email:
      <Input
        id="emailInputs"
        onChange={(event) => handleInputChange(event, "email")}
        value={updatedDataInputs.email}
      />
      <br />
      phone:
      <Input
        id="phoneInputs"
        onChange={(event) => handleInputChange(event, "phone")}
        value={updatedDataInputs.phone}
      />
      <br />
      city:
      <Input
        id="cityInputs"
        onChange={(event) => handleInputChange(event, "city")}
        value={updatedDataInputs.city}
      />
      <br />
      linkedin:
      <Input
        id="linkedinInputs"
        onChange={(event) => handleInputChange(event, "linkedin")}
        value={updatedDataInputs.linkedin}
      />
      <br />
      status:
      <Input
        id="statusInputs"
        onChange={(event) => handleInputChange(event, "status")}
        value={updatedDataInputs.status}
      />
      <br />
      <button onClick={handleEditUser}>Save</button>
      <br />
      current password:
      <Input
        type="password"
        id="currentPasswordInputs"
        onChange={(event) =>
          handlePasswordInputChange(event, "currentPassword")
        }
        value={passwordChangeInput.currentPassword}
      />
      <br />
      new password:
      <Input
        type="password"
        id="newPasswordInputs"
        onChange={(event) => handlePasswordInputChange(event, "newPassword")}
        value={passwordChangeInput.newPassword}
        required
      />
      <br />
      <button onClick={handlePasswordChange}>change password</button>
      <br />
    </div>
  );
};

export default AccountSettings;
