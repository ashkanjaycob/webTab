import React from "react";
import { useDispatch } from "react-redux";
import { clearForm, logout } from "../../../features/auth/authSlice"; 
import { useNavigate } from "react-router-dom"; 
import { deleteCookie } from "../../../utils/cookie";

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("userToken");
    deleteCookie("refreshToken");
    dispatch(logout());
    dispatch(clearForm());
    navigate("/login");
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
