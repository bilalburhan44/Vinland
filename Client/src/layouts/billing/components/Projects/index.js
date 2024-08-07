import React, { useEffect, useState } from "react";
import { message, Space } from "antd";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Icon, IconButton, TablePagination } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import ProjectModal from "components/Modal/projectModal";
import { getProject } from "apicalls/projects";
import ProjectsTableData from "./data/projectsTableData";
import Table from "examples/Tables/Table";
import { getTransaction } from "apicalls/transaction";
import { deleteProject } from "apicalls/projects";
import moment from "moment-timezone";

function Projects() {
  const { id, clientId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null); // State to track transaction to edit


  
  const handleBack = () => {
    navigate(-1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchProjects = async () => {
    try {
      const response = await getProject(id);
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction); // Set transaction to edit
    setOpen(true); // Open the modal for editing
    fetchTransactions();
  };

  const fetchTransactions = async (projectId) => {
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

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await deleteProject( projectId); // Adjust to your API call
      if (response.success) {
        message.success("Project deleted successfully");
        fetchProjects(); // Refresh the projects list
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((project) => {
        fetchTransactions(project.id);
      });
    }
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, [id]);

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

  return (
    <DashboardLayout>
      <IconButton onClick={handleBack} aria-label="back">
        <ArrowBackIcon />
      </IconButton>
      <DashboardNavbar />

      <SoftBox display="flex" justifyContent="flex-end" mb={2}>
        <SoftButton variant="gradient" color="info" onClick={() => setOpen(!open)}>
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add Project
        </SoftButton>
      </SoftBox>
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
            transactions: transactions[project.id] || [] , fetchTransactions, onEdit: handleEditTransaction
          });
          return (
            <SoftBox key={project.id} mb={3}>
            <Card id="delete-account"  >
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftBox width="100%" display="flex" flexDirection="column">
            <SoftBox
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              mb={2}
            >
              <SoftTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {project.project_name}
              </SoftTypography>
    
            </SoftBox>
            <SoftBox mb={1} lineHeight={0}>
              <SoftTypography variant="caption" color="text">
                Status:&nbsp;&nbsp;&nbsp;
                <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
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
                <SoftBox mr={1}>
                  <SoftButton variant="text" color="dark"  onClick={() => handleEdit(project)}>
                    <Icon>edit</Icon>&nbsp;edit
                  </SoftButton>
                  <SoftButton variant="text" disabled={transactions[project.id]?.length > 0}  color="error" onClick={() => handleDeleteProject(project.id)}>
                    <Icon>delete</Icon>&nbsp;delete
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <SoftBox pt={1} pb={2} px={2}>
                <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                  <SoftBox component="li" display="flex" flexDirection="column" p={1} mb={1}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Table
                        columns={tableData.columns}
                        rows={tableData.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                      />
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={tableData.rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "16px",
                        }}
                        SelectProps={{
                          style: {
                            fontSize: "0.875rem",
                            marginRight: "8px",
                          },
                        }}
                        labelRowsPerPage="Rows per page:"
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} of ${count}`
                        }
                      />
                    </Space>
                  </SoftBox>
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
        client_id={id}
        projectToEdit={projectToEdit}
        fetchProjects={fetchProjects}
        />
      )}
    </DashboardLayout>
  );
}

export default Projects;
