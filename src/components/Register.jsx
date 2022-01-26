import React, { useState } from "react";
import authService from "../services/authService";
import "../styles/login.css";

const Register = () => {
  let [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    course: "",
    cohort: "",
    status: ""
  });

  const handleChange = (event) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const handleSubmit = () => {
    authService.login({ ...input });
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="title">
          <h4 className="fadeIn first">Register</h4>
        </div>

        <div className="form">
          <input
            type="text"
            placeholder="Name"
            value={input.name}
            onChange={handleChange}
            id="name"
            className="fadeIn second"
          />
          <input
            type="text"
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
            id="email"
            className="fadeIn third"
          />
          <input
            type="password"
            placeholder="Password"
            value={input.password}
            onChange={handleChange}
            id="password"
            className="fadeIn fourth"
          />
          <input
            type="text"
            placeholder="Phone"
            value={input.phone}
            onChange={handleChange}
            id="phone"
            className="fadeIn fifth"
          />
          <input
            type="text"
            placeholder="City"
            value={input.city}
            onChange={handleChange}
            id="city"
            className="fadeIn sixth"
          />
          <input
            type="text"
            placeholder="Course"
            value={input.course}
            onChange={handleChange}
            id="course"
            className="fadeIn seventh"
          />
          <input
            type="text"
            placeholder="Cohort"
            value={input.cohort}
            onChange={handleChange}
            id="cohort"
            className="fadeIn eighth"
          />
          <input
            type="text"
            placeholder="Status"
            value={input.status}
            onChange={handleChange}
            id="status"
            className="fadeIn ninth"
          />

          <input
            type="button"
            value="register"
            onClick={handleSubmit}
            className="fadeIn tenth"
          />
        </div>

        {/* <div id="formFooter">
          <span>Dont have account?</span>
          <Link className="underlineHover" to="/register">
            Create one
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Register;
