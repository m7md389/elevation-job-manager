import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import auth from "./services/authService";
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
import AccountSettings from "./components/AccountSettings";
import AdminDashboard from "./components/AdminDashboard";
import Charts from "./components/Charts";

export default function App() {
  let [user, setUser] = useState(undefined);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUser(user);
  }, []);

  return (
    <BrowserRouter>
      {user && <NavBar />}

      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/courses/:courseName" element={<DetailedCourse />} />
        <Route path="/courses" element={<AdminHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/student/:id" element={<Student />} /> {/*/student/:id*/}
        <Route path="/student" element={<Student />} /> {/*/student/:id*/}
        <Route path="/charts" element={<Charts />} /> {/*/student/:id*/}
        <Route path="/" element={<AdminDashboard />} /> {/*/student/:id*/}


      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
