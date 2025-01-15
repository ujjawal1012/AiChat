import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import UserLogin from "../screens/userLogin";
import UserSignup from "../screens/userSignup";
import Project from "../screens/project";
import UserAuth from "../auth/userAuth";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <UserAuth>
            <Home />
          </UserAuth>
        }
      />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserSignup />} />
      <Route
        path="/project/:id"
        element={
          <UserAuth>
            <Project />
          </UserAuth>
        }
      />
       <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
