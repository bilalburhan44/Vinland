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

import React from 'react'
// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { getAllClients } from 'apicalls/client';
// Billing page components
import Bill from "layouts/billing/components/Bill";
import ClientsModal from 'components/Modal/clientsModal';
import { Icon } from '@mui/material';
import SoftButton from 'components/SoftButton';

function BillingInformation() {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState([]); // State to store the list of clients
  const [clientOptions, setClientOptions] = React.useState([]);
  const [ClientsToEdit, setClientsToEdit] = React.useState(null);
  const getClients = async () => {
    try {
      const response = await getAllClients();
      if (response.success) {
        setClients(response.data);
        setClientOptions(response.data.map(client => ({ value: client.name })));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  React.useEffect(() => {
    getClients();
  }, []);

  const handleEdit = (client) => {
    setClientsToEdit(client);
    setOpen(true);
  };
  return (
    <Card id="delete-account">
    {open && <ClientsModal open={open} setOpen={setOpen} ClientsToEdit={ClientsToEdit} refreshClients={getClients} />}
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          Clients Information
        </SoftTypography>
        <SoftButton variant="gradient" color="info" onClick={() => setOpen(!open)}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add Client
            </SoftButton>
        </SoftBox>
        <SoftBox pt={1} pb={2} px={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {clients.map((client) => (
            <Bill
              id={client.id}
              key={client.id}
              name={client.name}
              phone={client.phoneNumber}
              address={client.address}
              source={client.source}
              onEdit={()=>handleEdit(client)}
            />
          ))}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default BillingInformation;
