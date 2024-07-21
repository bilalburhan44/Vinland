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
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import { getWallet } from "../../apicalls/wallet";

import React, { useEffect, useState } from "react";
import { getExchangeRate } from "apicalls/exchangerate";
import SoftButton from "components/SoftButton";
import ChangeCurrencyModal from "components/Modal/changeCurrencyModal";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [wallet, setWallet] = useState({});
  const [exchangeRate, setExchangeRate] = useState(null);
  const [open, setOpen] = useState(false);

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
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    getWalletTotal();
    fetchExchangeRate();
  }, [wallet]);

  useEffect(() => {
    fetchExchangeRate();
  }, [exchangeRate]);
  
  
    // Calculate the total amount in USD and IQD
    const totalAmountUSD = wallet.totalAmountUSD ? wallet.totalAmountUSD : 0;
    const totalAmountIQD = wallet.totalAmountIQD ? wallet.totalAmountIQD / (exchangeRate/100) : 0;
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
              count={
                  `${formatUSD(totalSumIQD)}`
                }
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
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "today's 100 USD" }}
                count={formatIQD(exchangeRate)}
                icon={{
                  color: "info",
                  component: "shopping_cart",
                }}
              />
            </Grid>
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
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="active users"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
