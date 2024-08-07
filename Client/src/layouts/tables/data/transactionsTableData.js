import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { Menu, Dropdown, Space, message } from 'antd';
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import { Icon } from "@mui/material";
import { deleteTransaction, getTransactions } from "apicalls/transaction";
import { getTransactionProject } from "apicalls/projects";
import DownloadTransactionsPDF from "components/PDf-Template";
import DownloadTransactionPDF from "components/PDf-Template";

function Client({ name, phone }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox display="flex" flexDirection="column" ml={1}>
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {phone}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

Client.propTypes = {
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};

const TransactionsTableData = ({ filters, onEdit, transactions, project, fetchData }) => {

  const DeleteTransaction = async (id) => {
    try {
      const response = await deleteTransaction(id);
      if (response?.success) {
        message.success(response?.message);
        fetchData(); // Refresh data after deletion
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while deleting the transaction');
    }
  };

  const formatUSD = (amount) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatIQD = (amount) => {
    return amount.toLocaleString("en-IQ");
  };

  const rows = transactions?.map((data) => {
    const localDate = moment(data.date).tz("Asia/Baghdad").format("YYYY-MM-DD HH:mm");
    const { Client: clientDetails, User: userDetails } = data;
    
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => onEdit(data)}>
          Edit
        </Menu.Item>
        <Menu.Item key="2" danger onClick={() => DeleteTransaction(data.transaction_id)}>
          Delete
        </Menu.Item>
        <Menu.Item key="3" >
        <DownloadTransactionPDF transaction={data} client={clientDetails} />
        </Menu.Item>
      </Menu>
    );

    return {
      Projects_name: clientDetails && project[data.transaction_id] ? (
        <SoftTypography variant="caption" alignItems="center" color="secondary" fontWeight="medium">
          {project[data.transaction_id].project_name}
        </SoftTypography>
      ) : null,
      Clients_name: clientDetails ? (
        <Client name={clientDetails?.name} phone={clientDetails?.phoneNumber} />
      ) : null,
      IQD: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          {data.amount_iqd ? formatIQD(data.amount_iqd) : "0"}
        </SoftTypography>
      ),
      USD: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          {data.amount_usd ? formatUSD(data.amount_usd) : "$0.00"}
        </SoftTypography>
      ),
      type: (
        <SoftBadge
          variant="gradient"
          badgeContent={data.type}
          color={data.type === "income" ? "success" : "error"}
          size="xs"
          container
        />
      ),
      payment: (
        <SoftBadge
          variant="gradient"
          badgeContent={data.type === "income" ? data.payment : "-"}
          color="info"
          size="xs"
          container
        />
      ),
      Desc: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {data.description}
        </SoftTypography>
      ),
      Date: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {localDate}
        </SoftTypography>
      ),
      By: (
        <SoftTypography fontWeight="medium">{userDetails ? userDetails.name : ""}</SoftTypography>
      ),
      action: (
        <Space direction="vertical">
          <Space wrap>
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Icon
                sx={{ cursor: "pointer", fontWeight: "bold" }}
                fontSize="small"
                onClick={(e) => e.preventDefault()} // Prevent default behavior
              >
                more_vert
              </Icon>
            </Dropdown>
          </Space>
        </Space>
      ),
    };
  });

  const transactionsTableData = {
    columns: [
      { name: "Projects_name", align: "center" },
      { name: "Clients_name", align: "left" },
      { name: "IQD", align: "center" },
      { name: "USD", align: "center" },
      { name: "type", align: "center" },
      { name: "payment", align: "center" },
      { name: "Desc", align: "left" },
      { name: "Date", align: "center" },
      { name: "By", align: "left" },
      { name: "action", align: "center" },
    ],
    rows: rows,
  };

  return transactionsTableData;
};

export default TransactionsTableData;
