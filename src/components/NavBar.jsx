import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Final Project
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarFinalProject"
        aria-controls="navbarFinalProject"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarFinalProject">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-item nav-link" to="/register">
            Register
          </NavLink>
          <NavLink className="nav-item nav-link" to="/logout">
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
