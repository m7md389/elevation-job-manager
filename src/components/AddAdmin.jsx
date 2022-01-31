import React, { useState } from "react";
import { toast } from "react-toastify";
import user from "../services/userService";
import "../styles/login.css";

const Register = () => {
  let [inputs, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = async () => {
    try {
      await user.addAdmin({ ...inputs });
      toast.success("Admin added sucessfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
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
              type="text"
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
            <input
              type="text"
              placeholder="Phone"
              value={inputs.phone}
              onChange={handleChange}
              id="phone"
              className="input fadeIn fifth"
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
