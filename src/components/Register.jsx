import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../services/authService";
import user from "../services/userService";
import cohort from "../services/cohortService";
import "../styles/login.css";

const Register = () => {
  let [inputs, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    linkedin: "",
    cohortId: "default",
    status: "default"
  });
  let [courses, setCourses] = useState([]);
  const statusOptions = ["Studying", "Searching", "Working"];

  useEffect(async () => {
    const c = await cohort.getCohorts();
    setCourses(c);
  }, []);

  const handleChange = (event) => {
    setInput({ ...inputs, [event.target.id]: event.target.value });
  };

  const doSubmit = async () => {
    try {
      const response = await user.register({ ...inputs });
      const token = response.headers["x-auth-token"];
      auth.loginWithToken(token);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  if (auth.getCurrentUser()) return <Navigate to="/" />;

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent" className="register-content">
        <div className="title">
          <h4 className="fadeIn first">Register</h4>
        </div>

        <div className="form">
          <div className="register-inputs-container">
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
            <input
              type="text"
              placeholder="City"
              value={inputs.city}
              onChange={handleChange}
              id="city"
              className="input fadeIn sixth"
            />
            <input
              type="text"
              placeholder="LinkedIn"
              value={inputs.linkedin}
              onChange={handleChange}
              id="linkedin"
              className="input fadeIn seventh"
            />
            <select
              className="input fadeIn ninth"
              name="cohort"
              onChange={handleChange}
              id="cohort"
              value={inputs.cohortId}
            >
              <option className="default-value" value="default" disabled>
                Cohort
              </option>
              {courses.map((course) => (
                <optgroup
                  key={course.title}
                  label={course.title}
                  value={course.title}
                >
                  {course.cohorts.map((cohort) => (
                    <option key={cohort._id} value={cohort._id}>
                      {cohort.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              className="input fadeIn eleventh"
              name="status"
              onChange={handleChange}
              id="status"
              value={inputs.status}
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
          </div>

          <input
            type="button"
            value="register"
            onClick={doSubmit}
            className="submit fadeIn twelfth"
          />
        </div>

        <div id="formFooter">
          <span>Already registered?</span>
          <Link className="custom-link underlineHover" to="/login">
            <span className="link-text">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
