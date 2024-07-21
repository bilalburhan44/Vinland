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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import React from "react";
// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { deleteClient } from "apicalls/client";
import { message } from "antd";
import { getAllClients } from "apicalls/client";

function Bill({ name, phone, address, source, noGutter, id, onEdit }) {
const [clients, setClients] = React.useState([]);
const [clientOptions, setClientOptions] = React.useState([]);
const [loading, setLoading] = React.useState(false);


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
  }, [loading]);

  const deleteclient = async(id) => {
    try {
      setLoading(true);
      const response = await deleteClient(id);
      if(response.success) {
        message.success(response.message);
        getClients();
        setLoading(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }


  return (
    <SoftBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor="grey-100"
      borderRadius="lg"
      p={3}
      mb={noGutter ? 0 : 1}
      mt={2}
    >
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <SoftTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {name}
          </SoftTypography>

          <SoftBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
          >
            <SoftBox mr={1}>
              <SoftButton variant="text" color="error" onClick={() => deleteclient(id)}>
                <Icon>delete</Icon>&nbsp;delete
              </SoftButton>
            </SoftBox>
            <SoftButton variant="text" color="dark" onClick={onEdit}>
              <Icon>edit</Icon>&nbsp;edit
            </SoftButton>
          </SoftBox>
        </SoftBox>
        <SoftBox mb={1} lineHeight={0}>
          <SoftTypography variant="caption" color="text">
            Phone Number:&nbsp;&nbsp;&nbsp;
            <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              {phone}
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1} lineHeight={0}>
          <SoftTypography variant="caption" color="text">
            Address:&nbsp;&nbsp;&nbsp;
            <SoftTypography variant="caption" fontWeight="medium">
              {address}
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="caption" color="text">
          Source:&nbsp;&nbsp;&nbsp;
          <SoftTypography variant="caption" fontWeight="medium">
            {source}
          </SoftTypography>
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Bill;
