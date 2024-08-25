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

import React from "react";
import { useSelector } from "react-redux";
// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Clients from "layouts/billing";
import RTL from "layouts/rtl";
import SignUp from "layouts/authentication/sign-up";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CreditCard from "examples/Icons/CreditCard";
import DailyTotal from "layouts/daily-total";
import Projects from "layouts/billing/components/Projects";
import AllProjects from "layouts/projects";
import ProjectsInformation from "layouts/projects/projectInformation";
import CustomerSupport from "examples/Icons/CustomerSupport";
import Users from "layouts/users";

const getRoutes = (isAdmin) => [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Transactions",
    key: "transactions",
    route: "/transactions",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Daily Transactions",
    key: "daily-total",
    route: "/daily-total",
    icon: <Document size="12px" />,
    component: <DailyTotal />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Contacts",
    key: "Contacts",
    route: "/contacts",
    icon: <CreditCard size="12px" />,
    component: <Clients />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    route: "/projects",
    icon: <Office size="12px" />,
    component: <ProjectsInformation />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  
    {
    type: "collapse",
    name: "Users",
    key: "users",
    route: "/users",
    icon: <CustomerSupport size="12px" />,
    component: <Users />,
    noCollapse: true,
  }
  ,
  isAdmin && {
    type: "collapse",
    name: "Add User",
    key: "add-user",
    route: "/add-user",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
].filter(Boolean); // This filters out any falsey values (like false, null, undefined)

const AllRoutes = () => {
  const { user } = useSelector((state) => state.users);
  const isAdmin = user?.data?.role === "admin";
  const routes = getRoutes(isAdmin);

  return routes; // Ensure these routes are rendered in the appropriate component
};

export default AllRoutes;

