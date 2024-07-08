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

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { RegisterUser } from "../../../apicalls/users";

import {message} from 'antd'

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";

function SignUp() {
  const [agreement, setAgremment] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetAgremment = () => setAgremment(!agreement);

  const onsubmit = async (event) => {
    event.preventDefault();
    const formValues = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    try {
      
      const response = await RegisterUser(formValues);
    
      if (response.success) {
      message.success("user created successfuly")
        navigate("/dashboard");
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error("Error :",error)
    }
  };
  

  return (
    <BasicLayout
      title="Welcome!"
      description="Here You can Create New User"
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Create User with
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2}>
          <Socials />
        </SoftBox>
        <Separator />
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form" onSubmit={onsubmit}>
            <SoftBox mb={2}>
              <SoftInput placeholder="Name" name="name" id="name" required={"true"} />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput type="email" placeholder="Email"  name="email" id="email" required={"true"} />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput type="password" placeholder="Password" name="password"
              id="password" />
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth type="submit">
                Add User
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
