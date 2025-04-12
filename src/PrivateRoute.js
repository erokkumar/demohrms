import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true"; // Check if the user is logged in
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/sign-in" />;
};

// Validate the 'element' prop
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired, // ✅ Use PropTypes.element instead of node
};

export default PrivateRoute;
