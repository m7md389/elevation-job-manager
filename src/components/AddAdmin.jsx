import React, { useState } from "react";
import { toast } from "react-toastify";

import user from "../services/userService";

import "../styles/login.css";

const Register = () => {
  let [inputs, setInput] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = async () => {
    try {
      await user.addAdmin({ ...inputs });
      toast.success("Admin added successfully");
    } catch (ex) {
      if (ex.data.error) {
        toast.error(ex.data.error);
      }
    }
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent" className="login-content">
        <div className="title">
          <h4 className="fadeIn first">Add Admin</h4>
        </div>

        <div className="form">
          <div className="add-admin-inputs-container">
            <input
              type="text"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              id="name"
              className="input fadeIn second"
            />
            <input
              type="email"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              id="email"
              className="input fadeIn third"
            />
            <input
              type="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              id="password"
              className="input fadeIn fourth"
            />
          </div>

          <input
            type="button"
            value="add"
            onClick={doSubmit}
            className="submit fadeIn twelfth"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
