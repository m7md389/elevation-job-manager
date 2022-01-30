import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

const NavBar = () => {
  const [isOpenedDropdown, setIsOpenedDropdown] = useState(false);
  const [isOpenedNavbar, setIsOpenedNavbar] = useState(false);
  const menuClass = `dropdown-menu${isOpenedDropdown ? " show" : ""}`;
  const navbarClass = `collapse navbar-collapse${
    isOpenedNavbar ? " show" : ""
  }`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        <img
          className="ms-4 me-3"
          src="https://elevation.ac/wp-content/uploads/2020/08/Elevation_logo_website_mobile.png"
          width="180"
          alt=""
        />
      </NavLink>
      <button
        className="navbar-toggler"
        onClick={() => {
          setIsOpenedNavbar(!isOpenedNavbar);
        }}
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className={navbarClass} id="navbarNav">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link nav-link-tabs" to="/courses">
            Courses
          </NavLink>
          <NavLink className="nav-item nav-link nav-link-tabs" to="/charts">
            Charts
          </NavLink>

          <span
            id="user-settings-icon"
            className="nav-item dropdown"
            onClick={() => setIsOpenedDropdown(!isOpenedDropdown)}
          >
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src="https://www.pngfind.com/pngs/m/34-349693_circled-user-icon-transparent-background-username-icon-hd.png"
                width="30"
                height="30"
                alt=""
              />
            </Link>

            <div
              id="user-settings-dropdown"
              className={menuClass}
              aria-labelledby="navbarDropdown"
            >
              <NavLink className="dropdown-item" to="settings">
                Settings
              </NavLink>
              <NavLink className="dropdown-item" to="logout">
                Logout
              </NavLink>
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
