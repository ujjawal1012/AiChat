import "remixicon/fonts/remixicon.css";
import "./App.css";
import React from "react";
import AppRoutes from "./routes/routes";
// import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/user.context";


const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
