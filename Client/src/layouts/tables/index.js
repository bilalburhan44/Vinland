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
import React , { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import TransactionsTableData from "layouts/tables/data/transactionsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import TransactionModal from "components/Modal/transactionModal";
import TablePagination from "@mui/material/TablePagination";

function Tables() {
  const transactionsTableData = TransactionsTableData();
  const { columns, rows } = transactionsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the index of the first and last rows to display
  const lastIndex = page * rowsPerPage + rowsPerPage;
  const firstIndex = page * rowsPerPage;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {open && <TransactionModal open={open} setOpen={setOpen} />}
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6" size="medium">Transactions</SoftTypography>
              <SoftButton variant="gradient" color="info" onClick={() => setOpen(!open)}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add Transaction
            </SoftButton>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
            <Table
            columns={columns}
            rows={rows.slice(firstIndex, lastIndex)} // Slice rows based on pagination
            />
            <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px", // Adjust margin top as needed
        }}
        SelectProps={{
          style: {
            fontSize: "0.875rem", // Adjust font size
            marginRight: "8px", // Adjust margin right as needed
          },
        }}
        labelRowsPerPage="Rows per page:" // Customize label
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />
            </SoftBox>
          </Card>
        </SoftBox>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftTypography variant="h6">Projects table</SoftTypography>
          </SoftBox>
          <SoftBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <Table columns={prCols} rows={prRows} />
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
