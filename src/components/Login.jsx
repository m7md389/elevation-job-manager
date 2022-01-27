import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/userService";
import "../styles/login.css";

const Login = () => {
  let [inputs, setInput] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = () => {
    authService.login(inputs);
  };

  return (
    <div className="wrapper fadeInDown ">
      <div id="formContent">
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
            className="fadeIn second"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            id="password"
            className="fadeIn third"
          />
          <input
            type="submit"
            onClick={handleSubmit}
            className="fadeIn fourth"
          />
        </div>

        <div id="formFooter">
          <span>Dont have account?</span>
          <Link className="underlineHover" to="/register">
            <span className="link-text">Create one</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
