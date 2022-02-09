import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import auth from "../services/authService";

import "../styles/navbar.css";

const NavBar = () => {
  const [isOpenedDropdown, setIsOpenedDropdown] = useState(false);
  const [isOpenedNavbar, setIsOpenedNavbar] = useState(false);
  const menuClass = `dropdown-menu${isOpenedDropdown ? " show" : ""}`;
  const navbarClass = `collapse navbar-collapse${
    isOpenedNavbar ? " show" : ""
  }`;

  const currentUser = auth.getCurrentUser();

  
  const [scrollPosition , setScrollPosition]= useState(0)

  const handleScroll = () =>{
    setScrollPosition(document.documentElement.scrollTop)
  }

  useEffect(()=> {
  window.addEventListener('scroll',handleScroll);
  },[])

  return (
    <nav
      id="navbar"
      className= {scrollPosition === 0 ? "navbar navbar-expand-lg navbar-light  my-navbar-container nv-white" :"navbar navbar-expand-lg navbar-light  my-navbar-container nv-pink"} 
    >
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
        <span className="navbar-toggler-icon shadow-none" />
      </button>

      <div className={navbarClass} id="navbarNav">
        <div className="navbar-nav">
          <div className={ scrollPosition === 0 ? "navbar-links-content-container-black" : "navbar-links-content-container"}>
            {currentUser.role === "admin" && (
              <NavLink
                className="nav-item nav-link nav-link-tabs"
                to="/courses"
              >
                Courses
              </NavLink>
            )}
            {currentUser.role === "admin" && (
              <NavLink className="nav-item nav-link nav-link-tabs" to="/charts">
                Charts
              </NavLink>
            )}
            {currentUser.role === "admin" && (
              <NavLink
                className="nav-item nav-link nav-link-tabs"
                to="/add-admin"
              >
                Add Admin
              </NavLink>
            )}
            <NavLink className="nav-item nav-link nav-link-tabs" to="settings">
              Settings
            </NavLink>
            <NavLink className="nav-item nav-link nav-link-tabs" to="logout">
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
