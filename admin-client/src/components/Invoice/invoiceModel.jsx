import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

export const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items = [],
  taxAmount,
  discountAmount,
  subTotal,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  );
  const billFrom = info?.billFrom || "Dr. Gaurav Pandey";
  // console.log(items)
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={style} id="invoiceCapture">
        <Typography variant="h4" gutterBottom>
          {billFrom}
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" gutterBottom>
            Date: {currentDateTime}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Patient: {info.billTo}
          </Typography>
        </div>
        <Typography variant="h6" color="textSecondary">
          Invoice Number: {info?.invoiceNumber || ""}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          Amount: {currency} {total}
        </Typography>


        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>QTY</TableCell>
                <TableCell>DESCRIPTION</TableCell>
                <TableCell align="right">PRICE</TableCell>
                <TableCell align="right">AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.name} - {item.description}
                    </TableCell>
                    <TableCell align="right">
                      {currency} {item.price}
                    </TableCell>
                    <TableCell align="right">
                      {currency} {item.price * item.quantity}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No items available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </TableContainer>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell align="right" className="fw-bold">
                SUBTOTAL
              </TableCell>
              <TableCell align="right">
                {currency} {subTotal}
              </TableCell>
            </TableRow>
            {taxAmount !== 0.0 && (
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" className="fw-bold">
                  TAX
                </TableCell>
                <TableCell align="right">
                  {currency} {taxAmount}
                </TableCell>
              </TableRow>
            )}
            {discountAmount !== 0.0 && (
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" className="fw-bold">
                  DISCOUNT
                </TableCell>
                <TableCell align="right">
                  {currency} {discountAmount}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell align="right" className="fw-bold">
                TOTAL
              </TableCell>
              <TableCell align="right">
                {currency} {total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {info?.notes && (
          <Box mt={2} p={2} bgcolor="#63e5ff" borderRadius={2}>
            <Typography>{info.notes}</Typography>
          </Box>
        )}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<BiCloudDownload />}
          onClick={GenerateInvoice}
          fullWidth
          sx={{ mt: 2 }}
        >
          Download Copy
        </Button>
      </Box>
    </Modal>
  );
};
