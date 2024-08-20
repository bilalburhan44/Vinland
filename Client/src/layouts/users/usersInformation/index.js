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
import { Icon } from "@mui/material";
import SoftButton from "components/SoftButton";
import ProjectModal from "components/Modal/projectModal";
import { getAllProjects } from "apicalls/projects";
import moment from "moment-timezone";
import ProjectsTableData from "layouts/billing/components/Projects/data/projectsTableData";
import { message } from "antd";
import DetailedProjectModal from "components/Modal/detailedProjectModal";
import { getAllUsers } from "apicalls/users";
import { deleteUser } from "apicalls/users";
import { getUserTransaction } from "apicalls/transaction";
import { useSelector } from "react-redux";
import UserModal from "components/Modal/userModal";

function UsersInformation() {
  const [open, setOpen] = React.useState(false);
  const [detailprojectopen, setDetailprojectopen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [userToEdit, setUserToEdit] = React.useState(null);
  const [transactions, setTransactions] = useState([]);
  const { user } = useSelector((state) => state.users);
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      if (response.success) {
        setUsers(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getAllProjects();
      if (response.success) {
        setProjects(response.data);
        response.data.forEach((project) => {
          fetchTransactions(project?.user_id);
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchTransactions = async (id, projectId) => {
    try {
      const response = await getUserTransaction(id);
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
    const fetchAllData = async () => {
      await fetchUsers();
      await fetchProjects();
    };
    fetchAllData();
  }, []);

  const handleEdit = (users) => {
    setUserToEdit(users);
    setOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        message.success("User deleted successfully");
        fetchUsers();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const filteredUsers = user?.data?.role === "admin" ? users : users.filter((cuser) => cuser.id === user?.data?.id);


  return (
    <SoftBox>
      {filteredUsers?.length === 0 ? (
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
                No Users found
              </SoftTypography>
              <SoftTypography variant="body1" color="textSecondary" mt={2}>
                There are no Users available.
              </SoftTypography>
            </SoftBox>
          </Card>
        </SoftBox>
      ) : (
        filteredUsers.map((cuser) => {
          const tableData = ProjectsTableData({
            transactions: transactions[cuser.id] || [],
          });
          return (
            <SoftBox key={cuser.id} mb={3}>
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
                        {cuser.email}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        User Name:&nbsp;&nbsp;&nbsp;
                        <SoftTypography
                          variant="caption"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {cuser?.name}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Password:&nbsp;&nbsp;&nbsp;
                        <SoftTypography
                          variant="caption"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {cuser.password}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Role:&nbsp;&nbsp;&nbsp;
                        <SoftTypography
                          variant="caption"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {cuser.role}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="text">
                        Created At:&nbsp;&nbsp;&nbsp;
                        <SoftTypography variant="caption" fontWeight="medium">
                          {moment(cuser.createdAt).tz("Asia/Baghdad").format("YYYY-MM-DD")}
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                  <SoftBox display="flex" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                   { user?.data?.role === "admin" && <SoftBox mr={1}>
                      <SoftButton
                        variant="text"
                        disabled={Object.values(transactions)
                          .flat()
                          .some((transaction) => transaction.user_id === cuser.id)}
                        color="error"
                        onClick={() => handleDeleteUser(cuser.id)}
                      >
                        <Icon>delete</Icon>&nbsp;delete
                      </SoftButton>
                    </SoftBox>}

                    <SoftButton variant="text" color="dark" onClick={() => handleEdit(cuser)}>
                      <Icon>edit</Icon>&nbsp;edit
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </Card>
            </SoftBox>
          );
        })
      )}
      {open && <UserModal open={open} setOpen={setOpen} userToEdit={userToEdit} fetchUsers={fetchUsers} />}
    </SoftBox>
  );
}

export default UsersInformation;
