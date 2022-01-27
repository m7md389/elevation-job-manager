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
    linkedin: "",
    course: "",
    cohort: "",
    status: ""
  });
  let [isdropdownCourseOpened, setIsdropdownCourseOpened] = useState(false);

  const handleChange = (event) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const handleSubmit = () => {
    authService.login({ ...input });
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent" className="register-content">
        <div className="title">
          <h4 className="fadeIn first">Register</h4>
        </div>

        <div className="form">
          <div className="inputs-container">
            <input
              type="text"
              placeholder="Name"
              value={input.name}
              onChange={handleChange}
              id="name"
              className="input fadeIn second"
            />
            <input
              type="text"
              placeholder="Email"
              value={input.email}
              onChange={handleChange}
              id="email"
              className="input fadeIn third"
            />
            <input
              type="password"
              placeholder="Password"
              value={input.password}
              onChange={handleChange}
              id="password"
              className="input fadeIn fourth"
            />
            <input
              type="text"
              placeholder="Phone"
              value={input.phone}
              onChange={handleChange}
              id="phone"
              className="input fadeIn fifth"
            />
            <input
              type="text"
              placeholder="City"
              value={input.city}
              onChange={handleChange}
              id="city"
              className="input fadeIn sixth"
            />
            <input
              type="text"
              placeholder="LinkedIn"
              value={input.linkein}
              onChange={handleChange}
              id="linkein"
              className="input fadeIn seventh"
            />
            <select
              className="input fadeIn ninth"
              name="course"
              defaultValue={"default"}
            >
              <option className="option" value="default" disabled>
                Course
              </option>
              <option className="option" value="full-stack">
                full-stack
              </option>
            </select>
            <select
              className="input fadeIn tenth"
              name="cohort"
              defaultValue={"default"}
            >
              <option className="option" value="default" disabled>
                Cohort
              </option>
              <option className="option" value="cohort-22">
                cohort-22
              </option>
            </select>
            <select
              className="input fadeIn eleventh"
              name="status"
              defaultValue={"default"}
            >
              <option className="option" value="default" disabled>
                Status
              </option>
              <option className="option" value="stydying">
                Studying
              </option>
            </select>
          </div>

          <input
            type="button"
            value="register"
            onClick={handleSubmit}
            className="submit fadeIn twelfth"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
