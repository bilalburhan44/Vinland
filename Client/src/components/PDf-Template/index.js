// React Component
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import brand from "../../assets/images/V_logo.png";
import brandName from "../../assets/images/Vinland.png";
import { getTransactionProject } from "apicalls/projects";
import fontBase64 from "./fontBase64"; // Corrected import

const DownloadTransactionPDF = ({ transaction, client }) => {
  const [projectData, setProjectData] = useState(null);

  const fetchProject = async () => {
    try {
      const response = await getTransactionProject(transaction.transaction_id);
      if (response.success) {
        setProjectData(response.data);
      }
    } catch (error) {
      console.error(error);
      // handle error appropriately
    }
  };

  useEffect(() => {
    fetchProject();
  }, [transaction.transaction_id]);

  const formatUSD = (amount) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatIQD = (amount) => {
    return `${amount.toLocaleString("en-IQ")} IQD`;
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add custom font to jsPDF
    doc.addFileToVFS("CustomFont.ttf", fontBase64);
    doc.addFont("CustomFont.ttf", "CustomFont", "normal");
    doc.setFont("CustomFont");

    // Add logo and brand name next to each other
    doc.addImage(brand, "PNG", 10, 8, 17, 22);
    doc.addImage(brandName, "PNG", 25, 10, 50, 20);

    // Add header text
    doc.setFontSize(30);
    doc.text("کۆمپانیایی ڤینلاند", 200, 20, { align: "right" });

    // Add a line below header with specific color
    doc.setLineWidth(0.5);
    doc.setDrawColor(90, 181, 175);
    doc.line(10, 30, 200, 30);

    // Add client and date information
    doc.setFontSize(12);
    doc.text(`Client Name: ${client?.name}`, 10, 40);
    doc.text(`Date: ${moment(transaction.date).tz("Asia/Baghdad").format("YYYY-MM-DD")}`, 150, 40, {
      align: "right",
    });

    // Add project name and transaction ID
    doc.text(`Project Name: ${projectData?.project_name}`, 10, 50);
    doc.setTextColor(255, 0, 0); // Set text color to red
    doc.text(`Transaction ID: ${transaction.transaction_id}`, 150, 50, { align: "right" });
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.setFont("CustomFont");

  const columns = ["IQD", "USD", "Description"];
  const rows = [
    [formatIQD(transaction.amount_iqd), formatUSD(transaction.amount_usd), transaction.description] ,
  ];
   doc.autoTable({
  startY: 60,
  head: [columns],
  body: rows,
  theme: "grid",
  styles: {
    font: "CustomFont", // Set your custom font here
    fontStyle: "normal", // or "bold" if needed
    halign: "center",
    cellPadding: 2,
  },
  headStyles: {
    font: "CustomFont", // Ensure the header uses the custom font
    fontStyle: "normal",
  },
  bodyStyles: {
    font: "CustomFont", // Ensure the body uses the custom font
    fontStyle: "normal",
  },
});

// Add total row
doc.autoTable({
  startY: doc.previousAutoTable.finalY + 10,
  body: [["Total : ", formatIQD(transaction.amount_iqd), formatUSD(transaction.amount_usd)]],
  theme: "plain",
  styles: {
    font: "CustomFont", // Set your custom font here
    fontStyle: "bold", // or "normal" if needed
    halign: "center",
  },
});


    // Add footer with signature and phone number
    doc.setFontSize(12);
    doc.text("Recipient Name: ______________________", 10, 280);
    doc.text("Signature : ______________________", 200, 280, { align: "right" });
    doc.text("Phone Number: ______________________", 10, 290);

    doc.save("transaction.pdf");
  };

  return <div onClick={generatePDF}>Download as PDF</div>;
};

DownloadTransactionPDF.propTypes = {
  transaction: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default DownloadTransactionPDF;
