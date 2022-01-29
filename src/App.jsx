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
import AdminHome from "./components/AdminHome";
import Student from "./components/Student";
import AccountSettings from "./components/AccountSettings";
import AdminDashboard from "./components/AdminDashboard";
import Charts from "./components/Charts";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

const App = () => {
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout setUser={setUser} />} />
        <Route
          path="/courses/:courseName"
          element={
            <ProtectedRoute isAdminPage>
              <DetailedCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute isAdminPage>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/:id"
          element={
            <ProtectedRoute isAdminPage>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute isStudentPage>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <ProtectedRoute isAdminPage>
              <Charts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAdminPage>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
