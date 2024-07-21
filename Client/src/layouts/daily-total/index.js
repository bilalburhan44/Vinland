import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import DailyTransactionTable from "layouts/daily-total/data/dailyTransactionTable";
import TablePagination from "@mui/material/TablePagination";
import { Space } from "antd";
import { getDailyTotal, deleteDailyNote } from "apicalls/dailyTotal";
import NoteModal from "components/Modal/noteModal";

function DailyTotal() {
  const [noteToAdd, setNoteToAdd] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null); // State to track transaction to edit
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [dailyTotal, setDailyTotal] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getDailyTotal();
      if (response.success) {
        setDailyTotal(response.data);
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
  }, []);

  const handleAddNote = (dailyTotal) => {
    setNoteToAdd(dailyTotal);
    setNoteToEdit(null);
    setOpen(true);
};

const handleEditNote = (dailyTotal) => {
    setNoteToEdit(dailyTotal);
    setNoteToAdd(null);
    setOpen(true);
};

const handleDeleteNote = async (dailyTotal) => {
    try {
        if (!dailyTotal.date) {
            console.error('Date is missing in dailyTotal');
            return;
        }

        const response = await deleteDailyNote(dailyTotal.date);
        if (response.success) {
            fetchData();
        } else {
            console.error('Error deleting note:', response.message);
        }
    } catch (error) {
        console.error('Error in handleDeleteNote:', error);
    }
};

  const dailyTransactionTableData = DailyTransactionTable({
    onAdd: handleAddNote,
    onEdit: handleEditNote,
    onDelete: handleDeleteNote,
    dailyTotal
  });
  const { columns, rows } = dailyTransactionTableData;

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
      {open && <NoteModal
        open={open}
        setOpen={setOpen}
        AddNote={noteToAdd}
        EditNote={noteToEdit}
        fetchData={fetchData}
    />}
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6" size="medium">Daily Transactions</SoftTypography>
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
                    marginTop: "16px",
                  }}
                  SelectProps={{
                    style: {
                      fontSize: "0.875rem",
                      marginRight: "8px",
                    },
                  }}
                  labelRowsPerPage="Rows per page:"
                  labelDisplayedRows={({ from, to, count }) => ` ${from}-${to} of ${count}`}
                />
              </Space>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DailyTotal;
