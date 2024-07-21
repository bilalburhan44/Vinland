/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LoginUser } from "../../../apicalls/users";
// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";

import { message } from "antd";
function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);


const onsubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await LoginUser({ email, password });
      if (response.success) {
        localStorage.setItem("token", response.data);
        navigate("/dashboard");
        message.success(response.message)
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };


  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
      <SoftBox component="form" role="form" onSubmit={onsubmit}>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth type="submit">
            sign in
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
