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

import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { getAllClients } from "apicalls/client";
import { Icon } from "@mui/material";
import SoftButton from "components/SoftButton";
import ProjectModal from "components/Modal/projectModal";
import { getAllProjects } from "apicalls/projects";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import moment from "moment-timezone";
import ProjectsTableData from "layouts/billing/components/Projects/data/projectsTableData";
import { getTransaction } from "apicalls/transaction";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";

function ProjectsInformation() {
    const [open, setOpen] = React.useState(false);
    const [projects, setProjects] = React.useState([]);
    const [projectToEdit, setProjectToEdit] = React.useState(null);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate()
    
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        if (response.success) {
          setProjects(response.data);
          response.data.forEach((project) => {
            fetchTransactions(project?.client_id,project.id);
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    };
  
    const fetchTransactions = async (id,projectId) => {
      try {
        const response = await getTransaction(id, projectId);
        if (response.success) {
            
          setTransactions((prevTransactions) => ({
            ...prevTransactions,
            [projectId]: response.data,
          }));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    };
  
    useEffect(() => {
      fetchProjects();
    }, [projects?.id]);
  
    const handleEdit = (projects) => {
      setProjectToEdit(projects);
      setOpen(true);
    };
  
    const formatUSD = (amount) => {
      return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };
  
    const handleDeleteProject = async (projectId) => {
      try {
        const response = await deleteProject(projectId);
        if (response.success) {
          message.success("Project deleted successfully");
          fetchProjects();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    const handlePreview = (id) => {
        navigate(`/client/${id}`);
      };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {projects?.length === 0 ? (
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
          sx={{ flexDirection: "column" }}
        >
          <Card sx={{ p: 8, textAlign: "center", backgroundColor: "#f0f0f0" }}>
            <SoftBox>
              <Icon sx={{ fontSize: 200, color: "#d3d3d3", mb: 4 }}>assignment_late</Icon>
              <SoftTypography variant="h2" fontWeight="bold" color="textPrimary">
                No projects found
              </SoftTypography>
              <SoftTypography variant="body1" color="textSecondary" mt={2}>
                It seems there are no projects associated with this client.
              </SoftTypography>
            </SoftBox>
          </Card>
        </SoftBox>
      ) : (
        projects.map((project) => {
          const tableData = ProjectsTableData({
            transactions: transactions[project.id] || [],
          });
          return (
            <SoftBox key={project.id} mb={3}>
              <Card id="delete-account">
                <SoftBox display="flex" justifyContent="space-between" p={3}>
                  <SoftBox width="100%" display="flex" flexDirection="column">
                    <SoftBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      mb={2}
                    >
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        textTransform="capitalize"
                      >
                        {project.project_name}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Client Name:&nbsp;&nbsp;&nbsp;
                        <SoftTypography
                          variant="caption"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {project?.Client?.name}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Status:&nbsp;&nbsp;&nbsp;
                        <SoftTypography
                          variant="caption"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {project.status}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Created At:&nbsp;&nbsp;&nbsp;
                        <SoftTypography variant="caption" fontWeight="medium">
                          {moment(project.createdAt).tz("Asia/Baghdad").format("YYYY-MM-DD HH:mm")}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Expected Income:&nbsp;&nbsp;&nbsp;
                        <SoftTypography variant="caption" fontWeight="medium">
                          {project.expectedIncome ? formatUSD(project.expectedIncome) : "$0.00"}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="caption" color="text">
                      User:&nbsp;&nbsp;&nbsp;
                      <SoftTypography variant="caption" fontWeight="medium">
                        {project?.User?.name}
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox
                    display="flex"
                    mt={{ xs: 2, sm: 0 }}
                    ml={{ xs: -1.5, sm: 0 }}
                  >
                    <SoftBox mr={1}>
                      <SoftButton variant="text" disabled={transactions[project.id]?.length > 0} color="error" onClick={() => handleDeleteProject(project.id)}>
                        <Icon>delete</Icon>&nbsp;delete
                      </SoftButton>
                    </SoftBox>
                    <SoftButton variant="text" color="dark" onClick={() => handleEdit(project)}>
                      <Icon>edit</Icon>&nbsp;edit
                    </SoftButton>
                    <SoftButton variant="text" color="dark" onClick={() => handlePreview(project?.client_id)}>
                      <Icon>preview</Icon>&nbsp;View
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </Card>
            </SoftBox>
          );
        })
      )}
      {open && (
        <ProjectModal
          open={open}
          setOpen={setOpen}
          client_id={projects.client_id}
          projectToEdit={projectToEdit}
          fetchProjects={fetchProjects}
        />
      )}
    </DashboardLayout>
  );
}

export default ProjectsInformation;
