import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <main>
        <Routes></Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
