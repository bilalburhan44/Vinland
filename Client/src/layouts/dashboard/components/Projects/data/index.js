// @mui material components
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftProgress from "components/SoftProgress";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";

import React from "react";
import { getAllProjects } from "apicalls/projects";
import { message } from "antd";

export default function data() {
  const [projects, setProjects] = React.useState([]);

  const formatUSD = (amount) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const fetchProjects = async () => {
    try {
      const response = await getAllProjects();
      if (response.success) {
        setProjects(response.data.slice(0, 5));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, [projects?.id]);

  const statusStages = {
    "first stage": { value: 20, color: "error" },
    "second stage": { value: 40, color: "warning" },
    "third stage": { value: 60, color: "secondary" },
    "fourth stage": { value: 80, color: "info" },
   "completed": { value: 100, color: "success" },
  };

  const rows = projects?.map((data) => {
    const stage = statusStages[data.status] || { value: 0, color: "default" };

    return {
      Projects: (
        <SoftTypography variant="caption" color="text" fontWeight="medium">
          {data?.project_name}
        </SoftTypography>
      ),
      Clients: (
        <SoftTypography variant="caption" color="text" fontWeight="medium">
          {data?.Client?.name}
        </SoftTypography>
      ),
      Expected_Income: (
        <SoftTypography variant="caption" color="text" fontWeight="medium">
          {formatUSD(data.expectedIncome)}
        </SoftTypography>
      ),
      Status: (
        <SoftBox width="8rem" textAlign="left" spacing={3}>
          <SoftProgress value={stage.value} color={stage.color} variant="gradient" label={false} mb={1} />
          <SoftTypography variant="caption" color="text" fontWeight="medium" mt={2}>
          {data.status}
        </SoftTypography>
        </SoftBox>
      ),
    };
  });

  return {
    columns: [
      { name: "Projects", align: "center" },
      { name: "Clients", align: "center" },
      { name: "Expected_Income", align: "center" },
      { name: "Status", align: "center" },
    ],
    rows: rows,
  };
}
