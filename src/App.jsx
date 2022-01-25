import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import Course from "./components/Course";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route
          path="/courses"
          element={<h3>{"<adminCourses />"} componen here</h3>}
        />
        <Route path="/courses/:name" element={<Course />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
