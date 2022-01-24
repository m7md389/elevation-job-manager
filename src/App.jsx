import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/PageNotFound";
import Logout from "./components/PageNotFound";
import Regester from "./components/PageNotFound";
import PageNotFound from "./components/PageNotFound";
import "./App.css";
import AdminHome from './components/AdminHome'
export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AdminHome />
      <Routes>
        <Route to="/login" element={<Login />} />
        <Route to="/logout" element={<Logout />} />
        <Route to="/register" element={<Regester />} />
        <Route to="/page-not-found" element={<PageNotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
