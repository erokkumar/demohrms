
import React, { useState } from "react";


// react-router-dom components

// @mui material components

// WorkScience React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Swal from "sweetalert2";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await axios.post("https://localhost:5000/api/login", {
        user_email: email,
        password: password,
      });

      if (response.data.token) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("emp_id", response.data.emp_id); // Save emp_id
        localStorage.setItem("user_name", response.data.empName); // Save user_name
        localStorage.setItem("role", response.data.role); // Save user_name
        localStorage.setItem("department", response.data.department); // Save user_name
        localStorage.setItem("profil", response.data.profil); // Save user_name
        localStorage.setItem("address", response.data.address); // Save user_name
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/"); // Redirect to <dashboard></dashboard>
      }
    } catch (err) {
      console.log(err,"show error")
      setError(err.response?.data?.error || "Login failed");
    }

  };
  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
 <form onSubmit={handleLogin} style={{ width: "100%" }}>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <div className="form-group">
                    <label htmlFor="email" style={{fontSize:'1vw'}}>Email address</label>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        style={{ width: "100%",  height: "40px", borderRadius: "10px", padding: "0 10px", border: "2px solid rgb(0, 0, 0)" }}
                        placeholder="USERNAME"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pwd" style={{fontSize:'1vw'}}>Password</label>
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        style={{ width: "100%", height: "40px", borderRadius: "10px", padding: "0 10px",border: "2px solid rgb(0, 0, 0)" }}
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                     
                    </div>
                  </div>

                  <button type="submit" style={{ width: "100%", height: "40px", borderRadius: "10px", padding: "0 10px", border: "none", marginTop:'10px', background: 'linear-gradient(90deg, rgba(0,151,255,1) 35%, rgba(0,69,255,1) 100%)', color:'white', cursor:'pointer' }} className="btn btn-primary">
                    Submit
                  </button>
                </form>
    </CoverLayout>
  );
}

export default SignIn;
