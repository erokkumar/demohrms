import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("role");

    // Redirect to login page after logout
    navigate("/sign-in");
  }, [navigate]);

  return <p>Logging out...</p>; // Display message while redirecting
};

export default Logout;
