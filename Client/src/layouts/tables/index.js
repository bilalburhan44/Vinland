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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import TransactionsTableData from "layouts/tables/data/transactionsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import TransactionModal from "components/Modal/transactionModal";
import TablePagination from "@mui/material/TablePagination";
import FilterModal from "components/Modal/filterModal";
import { Button, Space, Modal, message } from "antd";
import { getTransactions } from "apicalls/transaction";
import { getTransactionProject } from "apicalls/projects";

function Tables() {
  const [filters, setFilters] = useState({});
  const [transactionToEdit, setTransactionToEdit] = useState(null); // State to track transaction to edit
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [project, setProject] = useState([])
  const [totalUSDIncome, setTotalUSDIncome] = useState(0);
  const [totalUSDOutcome, setTotalUSDOutcome] = useState(0);
  const [totalIQDIncome, setTotalIQDIncome] = useState(0);
  const [totalIQDOutcome, setTotalIQDOutcome] = useState(0);


  const formatUSD = (amount) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatIQD = (amount) => {
    return amount.toLocaleString("en-IQ");
  };

  const fetchData = async () => {
    try {
      const response = await getTransactions(filters);
      if (response.success) {
        setTransactions(response.data);
        
        // Calculate totals
        const iqd_income = response.data.reduce((acc, transaction) => {
          return transaction.type === 'income' ? acc + transaction.amount_iqd : acc;
        }, 0);

        const usd_income = response.data.reduce((acc, transaction) => {
          return transaction.type === 'income' ? acc + transaction.amount_usd : acc;
        }, 0);
        
        const iqd_outcome = response.data.reduce((acc, transaction) => {
          return transaction.type === 'outcome' ? acc + transaction.amount_iqd : acc;
        }, 0);

        const usd_outcome = response.data.reduce((acc, transaction) => {
          return transaction.type === 'outcome' ? acc + transaction.amount_usd : acc;
        }, 0);

        setTotalIQDIncome(iqd_income);
        setTotalIQDOutcome(iqd_outcome);
        setTotalUSDIncome(usd_income);
        setTotalUSDOutcome(usd_outcome);

        const transactionIds = response.data.map((transaction) => transaction.transaction_id);
        fetchProjects(transactionIds);
      } else {
        throw new Error(response.message);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchProjects = async (transactionIds) => {
    try {
      const responses = await Promise.all(transactionIds.map(id => getTransactionProject(id)));
      const projectsData = responses.reduce((acc, response, index) => {
        if (response.success) {
          acc[transactionIds[index]] = response.data;
        }
        return acc;
      }, {});
      setProject(projectsData);
    } catch (error) {
      message.error(error.message);
    }
  };


  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction); // Set transaction to edit
    setOpen(true); // Open the modal for editing
    fetchData();
  };

  const handleAddTransaction = () => {
    setTransactionToEdit(null); // Clear ClientsToEdit state
    setOpen(true);
  };

  const transactionsTableData = TransactionsTableData({ filters, onEdit: handleEditTransaction, transactions, project, fetchData });
  const { columns, rows } = transactionsTableData;


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 
  const lastIndex = page * rowsPerPage + rowsPerPage;
  const firstIndex = page * rowsPerPage;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {open && (
        <TransactionModal
          open={open}
          setOpen={setOpen}
          transactionToEdit={transactionToEdit} // Pass transactionToEdit prop to TransactionModal
          refreshTransactions={fetchData}
        />
      )}
      {filterOpen && (
        <FilterModal filterOpen={filterOpen} setFilterOpen={setFilterOpen} setFilters={setFilters} />
      )}

      
      <SoftButton variant="gradient" color="info" onClick={() => setFilterOpen(!filterOpen)} sx={{ mt: 3 }}>
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }}>filter_list</Icon>
      </SoftButton>
      <SoftBox py={3}>
      <SoftBox mb={3}>
      <Card>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6" size="medium">Transactions</SoftTypography>
              <SoftButton variant="gradient" color="info" onClick={handleAddTransaction}>
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
            <Space direction="vertical" style={{ width: '100%' }}>
            <Table
              columns={columns}
              rows={rows.slice(firstIndex, lastIndex)}
              onEdit={handleEditTransaction} // Pass edit handler to table component
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
              labelDisplayedRows={({ from, to, count }) =>` ${from}-${to} of ${count}`}
            />
          </Space>
          <SoftBox p={2} mt={2} display="flex" justifyContent="space-between">
          <SoftTypography variant="h6" color="success">Total USD Income: {formatUSD(totalUSDIncome)}</SoftTypography>
          <SoftTypography variant="h6" color="success">Total IQD Income: {`${formatIQD(totalIQDIncome)} IQD`}</SoftTypography>
          <SoftTypography variant="h6" color="error">Total USD Outcome: {formatUSD(totalUSDOutcome)}</SoftTypography>
          <SoftTypography variant="h6" color="error">Total IQD Outcome: {`${formatIQD(totalIQDOutcome)} IQD`}</SoftTypography>
        </SoftBox>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
