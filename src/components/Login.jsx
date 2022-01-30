import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../services/authService";
import "../styles/login.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  let [inputs, setInput] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = async () => {
    try {
      await auth.login(inputs.email, inputs.password);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  if (auth.getCurrentUser()) return <Navigate to="/" />;

  return (
    <div className="wrapper fadeInDown ">
      <div id="formContent" className="login-content">
        <div className="title">
          <h4 className="fadeIn first">Login</h4>
        </div>

        <div className="form">
          <input
            type="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            id="email"
            className="input fadeIn second"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            id="password"
            className="input fadeIn third"
          />
          <input
            type="button"
            value="Login"
            onClick={doSubmit}
            className="submit fadeIn fourth"
          />
        </div>

        <div id="formFooter">
          <span>Don't have an account?</span>
          <Link className="custom-link underlineHover" to="/register">
            <span className="link-text">Create one</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
