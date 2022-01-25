import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import DetailedCourse from "./components/DetailedCourse";
import "./App.css";
import AdminHome from "./components/AdminHome";
import Student from "./components/Student";
export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/courses/:courseId" element={<DetailedCourse />} />
        <Route path="/courses" element={<AdminHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/" element={<Student />} /> {/*/student/:id*/}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
