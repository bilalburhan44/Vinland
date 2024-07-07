import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

import React, { useState, useEffect } from 'react';
import { getTransactions } from "apicalls/transaction";
import { getUserById } from "apicalls/users"; // Import the function to fetch user by ID
import PropTypes from "prop-types"; // Import PropTypes
import { getClientById } from "apicalls/client";

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
    const [userDetails, setUserDetails] = useState(null);
    const [clientDetails, setClientDetails] = useState([]);
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
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (transactions.length > 0) {
                const response = await getUserById(transactions[0].user_id); // Assuming userId is in the first transaction
                if (response.success) {
                    setUserDetails(response.data);
                    
                } else {
                    console.error('User not found');
                }
            }
        };

        fetchUserDetails();
    }, [transactions]);
    useEffect(() => {
        const fetchClientDetails = async () => {
            const updatedTransactions = [];
            for (const transaction of transactions) {
                console.log(transaction.client_id);
                const response = await getClientById(transaction.client_id);
                if (response.success) {
                    updatedTransactions.push(response.data); // Store client details directly
                } else {
                    console.error('Client details not found for transaction:', transaction);
                }
            }
            setClientDetails(updatedTransactions);
        };
    
        if (transactions.length > 0) {
            fetchClientDetails();
        }
    }, [transactions]);

    const rows = transactions?.map((data, index) => {
        const matchingClient = clientDetails?.find(client => client.id === data.client_id);
        return {
            Clients_name: matchingClient ? (
                <Client name={matchingClient.name} phone={matchingClient.phoneNumber} />
            ) : null,
            IQD: <SoftTypography variant="button" color="text" fontWeight="medium">{data.amount_iqd}</SoftTypography>,
            USD: <SoftTypography variant="button" color="text" fontWeight="medium">${data.amount_usd}</SoftTypography>,
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
                    {data.date}
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
