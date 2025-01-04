import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (user) {
      setLoading(false);
    }

    if (!user || !token) {
      setLoading(false);
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
