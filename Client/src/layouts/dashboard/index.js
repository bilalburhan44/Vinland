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

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Dashboard layout components

import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import { getWallet } from "../../apicalls/wallet";

import React, { useEffect, useState } from "react";
import { getExchangeRate } from "apicalls/exchangerate";
import SoftButton from "components/SoftButton";
import ChangeCurrencyModal from "components/Modal/changeCurrencyModal";
import { addExchangeRate } from "apicalls/exchangerate";
import { Input, Modal, Button } from "antd";
import RateModal from "components/Modal/rateModal";

function Dashboard() {
  const [wallet, setWallet] = useState({});
  const [open, setOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");
  const [newRate, setNewRate] = useState("");

  const formatUSD = (amount) => {
    return `$${amount?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatIQD = (amount) => {
    return amount?.toLocaleString("en-IQ");
  };

  const getWalletTotal = async () => {
    try {
      const response = await getWallet();
      if (response.success) {
        setWallet(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await getExchangeRate();
      if (response.success) {
        setExchangeRate(response.data.exchangeRate);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Use useEffect to run getWalletTotal and fetchExchangeRate once on component mount
  useEffect(() => {
    getWalletTotal();
    fetchExchangeRate();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Calculate the total amount in USD and IQD
  const totalAmountUSD = wallet.totalAmountUSD ? wallet.totalAmountUSD : 0;
  const totalAmountIQD = wallet.totalAmountIQD ? wallet.totalAmountIQD / (exchangeRate / 100) : 0;
  const totalSumIQD = totalAmountIQD + totalAmountUSD;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {open && <ChangeCurrencyModal open={open} setOpen={setOpen} />}
      <SoftButton variant="gradient" color="info" onClick={() => setOpen(!open)}>
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }}>cached</Icon>
      </SoftButton>
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Total Money" }}
                count={`${formatUSD(totalSumIQD)}`}
                percentage={{ color: "success", text: "+2%" }}
                icon={{ color: "info", component: "emoji_events" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Total Money (USD)" }}
                count={wallet.totalAmountUSD ? formatUSD(wallet.totalAmountUSD) : "$0.00"}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Total Money (IQD)" }}
                count={wallet.totalAmountIQD ? formatIQD(wallet.totalAmountIQD) : "0"}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} xl={3} onClick={() => setRateOpen(!rateOpen)}>
              <MiniStatisticsCard
                title={{ text: "today's 100 USD" }}
                count={formatIQD(exchangeRate)}
                icon={{ color: "info", component: "shopping_cart" }}
              />
              </Grid>
              {rateOpen && (
                <RateModal
                  rateOpen={rateOpen}
                  setRateOpen={setRateOpen}
                  initialRate={exchangeRate}
                  fetchExchangeRate={fetchExchangeRate}
                />
              )}
          </Grid>
        </SoftBox>
        {/*<SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
              </SoftBox>*/}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
