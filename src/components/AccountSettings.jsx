import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import http from "../services/httpService";
import auth from "../services/authService";
import Title from "./common/Title";

import { Input } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import "../styles/account-settings.css";

const useStyles = makeStyles({
  input: {
    color: "#0f213a",
    backgroundColor: "white",
    width: "80%",
    padding: "10px",
    borderRadius: "7px",
    border: "none",
    fontWeight: "bold"
  }
});

const AccountSettings = () => {
  const classes = useStyles();
  const currentUser = auth.getCurrentUser();
  let userId = currentUser._id;
  let URL = "/users/";
  const [updatedDataInputs, setUpdatedDataInputs] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    linkedin: ""
  });

  const [passwordChangeInput, setPasswordChangeInput] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const statusOptions = ["Studying", "Searching", "Working","no-info"];

  const [selectedStatus, setSelectedStatus] = useState("")

  useEffect(() => {
    http.get(`${URL}${userId}`).then((res) => {
      if(res.data.error){toast.error("Can't find user")}
      else{
        let user = res.data;
        setUpdatedDataInputs({
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          linkedin: user.linkedin,
        });
        setSelectedStatus(user.status)
      }
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
    if(!updatedDataInputs.name || !updatedDataInputs.email || !updatedDataInputs.phone || !updatedDataInputs.linkedin || !updatedDataInputs.city || !selectedStatus){toast.error("All fields are required please fill all the data.")}
    else{
      let tempUpdatedDataInputs = { ...updatedDataInputs };
      tempUpdatedDataInputs["userId"] = userId;
      tempUpdatedDataInputs["status"] = selectedStatus;
      http.put(`${URL}`, tempUpdatedDataInputs).then(res => {
        if(res.error){toast.error("Error updating user.")}
        else{toast.success("User updated successfully")}
      })
    }
  };

  const handlePasswordChange = () => {
    if(!passwordChangeInput.currentPassword || !passwordChangeInput.newPassword){ toast.error("Please fill both fields.")}
    else{
      let tempPasswordChangeInput = { ...passwordChangeInput };
      tempPasswordChangeInput["userId"] = userId;
      http.put(`${URL}password`, tempPasswordChangeInput).then((res) => {
        if (res.data.error) {
          toast.error("Current password not match the current password.");
        }
        else{toast.success("Password changed successfully.")}
      });
    }
  };

  const handleChange = (e) =>{
    setSelectedStatus(e.target.value);
  }

  return (
    <div className="inputs-container">
      <Title text="Settings" />

      <div className="intern-inputs">
        <div className="intern-div">
          <div className="input-label">
            <span>Name:</span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            id="nameInputs"
            onChange={(event) => handleInputChange(event, "name")}
            value={updatedDataInputs.name}
          />
          <br />

          <div className="input-label">
            <span>Email:</span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            id="emailInputs"
            onChange={(event) => handleInputChange(event, "email")}
            value={updatedDataInputs.email}
          />
          <br />

          <div className="input-label">
            <span>Phone:</span>
          </div>
          <Input
            type="tel"
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            id="phoneInputs"
            onChange={(event) => handleInputChange(event, "phone")}
            value={updatedDataInputs.phone}
          />
          <br />

          <div className="input-label">
            <span>City:</span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            id="cityInputs"
            onChange={(event) => handleInputChange(event, "city")}
            value={updatedDataInputs.city}
          />
          <br />

          <div className="input-label">
            <span>Linkedin: </span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            id="linkedinInputs"
            onChange={(event) => handleInputChange(event, "linkedin")}
            value={updatedDataInputs.linkedin}
          />
          <br />

          <div className="input-label">
            <span>Status: </span>
          </div>
           <select
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
              className="input"
              name="status"
              onChange={handleChange}
              id="status"
              value={selectedStatus}
            >
              <option className="default-value" value="default" disabled>
                Status
              </option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

          <div
            style={{ width: "100%", display: "grid", justifyContent: "center" }}
          >
            <button
              style={{
                transform: "translateY(1.276px)",
                backgroundColor: "#FF5777",
                margin: "10px 0",
                padding: "10px 30px",
                border: "1px solid white",
                borderRadius: "7px",
                color: "white",
                fontWeight: "bold"
              }}
              onClick={handleEditUser}
            >
              Save
            </button>
          </div>

          <div>
            <hr style={{ margin: "50px 0" }} />
          </div>

          <div className="input-label">
            <span>Current password: </span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            type="password"
            id="currentPasswordInputs"
            onChange={(event) =>
              handlePasswordInputChange(event, "currentPassword")
            }
            value={passwordChangeInput.currentPassword}
          />
          <br />

          <div className="input-label">
            <span>New password: </span>
          </div>
          <Input
            inputProps={{ className: classes.input }}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "7px"
            }}
            type="password"
            id="newPasswordInputs"
            onChange={(event) =>
              handlePasswordInputChange(event, "newPassword")
            }
            value={passwordChangeInput.newPassword}
            required
          />

          <div
            style={{ width: "100%", display: "grid", justifyContent: "center" }}
          >
            <button
              style={{
                backgroundColor: "#FF5777",
                margin: "10px 0",
                padding: "10px 30px",
                border: "1px solid white",
                borderRadius: "7px",
                color: "white",
                fontWeight: "bold"
              }}
              onClick={handlePasswordChange}
            >
              change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
