import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

import React, { useState, useEffect } from 'react';
import { getTransactions } from "apicalls/transaction";
import PropTypes from "prop-types"; // Import PropTypes
import moment from 'moment-timezone';


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

// Define PropTypes for Client component
Client.propTypes = {
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
};

const TransactionsTableData = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        try {
                const response = await getTransactions();
                if (response.success) {
                    setTransactions(response.data);
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
    }, [transactions]);

    const formatUSD = (amount) => {
        return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };
    
      const formatIQD = (amount) => {
        return amount.toLocaleString("en-IQ");
      };

 

    const rows = transactions?.map((data, index) => {
        const localDate = moment(data.date).tz('Asia/Baghdad').format('YYYY-MM-DD HH:mm');
        const { Client: clientDetails, User: userDetails } = data;
        return {
            Clients_name: clientDetails ? (
                <Client name={clientDetails?.name} phone={clientDetails?.phoneNumber} />
            ) : null,
            
            IQD: <SoftTypography variant="button" color="text" fontWeight="medium">{data.amount_iqd ? formatIQD(data.amount_iqd) : "0"}</SoftTypography>,
            USD: <SoftTypography variant="button" color="text" fontWeight="medium">{data.amount_usd ? formatUSD(data.amount_usd) : "$0.00"}</SoftTypography>,
            type: (
                <SoftBadge variant="gradient" badgeContent={data.type} color={data.type === 'income' ? 'success' : 'error'} size="xs" container />
            ),
            payment: (
                <SoftBadge variant="gradient" badgeContent={data.type === 'income' ? data.payment : '-'} color='info' size="xs" container />
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
            By: <SoftTypography fontWeight="medium">{userDetails ? userDetails.name : ''}</SoftTypography>,
            action: (
                <SoftTypography
                    component="a"
                    href="#"
                    variant="caption"
                    color="secondary"
                    fontWeight="medium"
                >
                    Edit
                </SoftTypography>
            ),
        };
    });

    const transactionsTableData = {
        columns: [
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
