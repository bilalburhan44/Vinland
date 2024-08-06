import React from "react";
import SoftTypography from "components/SoftTypography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment-timezone";

const DailyTransactionTable = ({ onAdd, onEdit, onDelete, dailyTotal }) => {
  
  
    const formatUSD = (amount) => {
      return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };
  
    const formatIQD = (amount) => {
      return amount.toLocaleString("en-IQ");
    };
  
  const rows = dailyTotal?.map((data) => {
    const localDate = moment(data.date).tz("Asia/Baghdad").format("YYYY-MM-DD");

    return {
      Date: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {localDate}
        </SoftTypography>
      ),
      Amount_USD: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {formatUSD(data.totalAmountUSD)}
        </SoftTypography>
      ),
      Amount_IQD: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {formatIQD(data.totalAmountIQD)}
        </SoftTypography>
      ),
      Notes: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {data.note}
        </SoftTypography>
      ),
      action: (
        <div>
          {data.note ? (
            <IconButton onClick={() => onEdit(data)}>
              <EditIcon style={{ color: "#3f51b5" }} />
            </IconButton>
          ) : (
            <IconButton onClick={() => onAdd(data)}>
              <AddIcon style={{ color: "#3f51b5" }} />
            </IconButton>
          )}
          {data.note && (
            <IconButton onClick={() => onDelete(data)}>
              <DeleteIcon style={{ color: "#f44336" }} />
            </IconButton>
          )}
        </div>
      ),
    };
  });

  const dailyTransactionTableData = {
    columns: [
      { name: "Date", align: "center" },
      { name: "Amount_USD", align: "center" },
      { name: "Amount_IQD", align: "center" },
      { name: "Notes", align: "center" },
      { name: "action", align: "center" },
    ],
    rows,
  };

  return dailyTransactionTableData;
};

export default DailyTransactionTable;
