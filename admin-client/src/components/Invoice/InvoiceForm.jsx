import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  MenuItem,
  InputAdornment,
  Select,
  Divider,
} from "@mui/material";
import { InvoiceItems } from "./invoiceItems.jsx";
import { InvoiceModal } from "./invoiceModel.jsx";
import { BASE_URL } from '../../config';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("₹");
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [billTo, setBillTo] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billFrom, setBillFrom] = useState("Dr. Gaurav Pandey");
  const [billFromEmail, setBillFromEmail] = useState('dantveda@gmail.com');
  const [billFromAddress, setBillFromAddress] = useState("");
  const [notes, setNotes] = useState(
    "Wishing you a healthy and happy smile! Dantveda 🦷"
  );
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      name: "",
      description: "",
      price: "1",
      quantity: 1,
    },
  ]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const newInvoiceNumber = `INV-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    setInvoiceNumber(newInvoiceNumber);
    setDateOfIssue(today);
  }, []);


  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = items
      .reduce((acc, item) => {
        return acc + parseFloat(item.price) * parseInt(item.quantity);
      }, 0)
      .toFixed(2);

    let newtaxAmount = (newSubTotal * (taxRate / 100)).toFixed(2);
    let newdiscountAmount = (newSubTotal * (discountRate / 100)).toFixed(2);
    let newTotal = (
      newSubTotal -
      newdiscountAmount +
      parseFloat(newtaxAmount)
    ).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newtaxAmount);
    setDiscountAmount(newdiscountAmount);
    setTotal(newTotal);
  }, [items, taxRate, discountRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (item) => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    setItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      name: "",
      price: "1",
      description: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(updatedItems);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    handleCalculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("BILL:", billFrom)
    if (!billFrom || !billTo || !total) {
      console.error('Please fill in all required fields.');
      return;
    }
    const formData = {
      invoiceNumber: invoiceNumber,
      billFrom: billFrom,
      billTo: billTo,
      dateOfIssue: new Date(dateOfIssue).toISOString(),
      notes: notes,
      items: items.map(item => ({
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
      })),
    };
    // console.log('Submitting invoice data:', formData);

    try {
      const response = await axios.post(`${BASE_URL}/admin/invoices`, formData);
      toast.success("Invoice saved successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      // console.log('Invoice submitted successfully:', response.data);
    } catch (error) {
      console.error('Error saving invoice:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" marginLeft={"25rem"} marginBottom={"2rem"}>
        Generate Invoice
      </Typography>
      <Box component="form" onSubmit={openModal} sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 4, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Today's Date: {currentDate}
                  </Typography>
                </Box>
                <Box>
                  <TextField
                    label="Invoice Number"
                    type="text"
                    value={invoiceNumber}
                    onChange={handleChange(setInvoiceNumber)}
                    sx={{ mt: 2 }}
                    required
                  />

                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Bill From:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Who is this invoice from?"
                    value={billFrom}
                    onChange={handleChange(setBillFrom)}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={billFromEmail}
                    onChange={handleChange(setBillFromEmail)}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Billing address"
                    value={billFromAddress || 'Clinic'}
                    onChange={handleChange(setBillFromAddress)}
                    required
                    sx={{ mt: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Bill To:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Who is this invoice to?"
                    value={billTo}
                    onChange={handleChange(setBillTo)}
                    required
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Billing address"
                    value={billToAddress}
                    onChange={handleChange(setBillToAddress)}
                    required
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
              <InvoiceItems
                onItemizedItemEdit={onItemizedItemEdit}
                onRowAdd={handleAddEvent}
                onRowDel={handleRowDel}
                currency={currency}
                items={items}
              />
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">
                  Subtotal: {currency}{subTotal}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Discount: ({discountRate || 0}%) {currency}{discountAmount || 0}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Tax: ({taxRate || 0}%) {currency}{taxAmount || 0}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Total: {currency}{total || 0}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Notes"
                value={notes}
                onChange={handleChange(setNotes)}
                multiline
                rows={3}
                sx={{ mt: 3 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: "20px" }}>
              <InvoiceModal
                showModal={isOpen}
                closeModal={closeModal}
                info={{
                  dateOfIssue,
                  invoiceNumber,
                  billTo,
                  billToAddress,
                  billFrom,
                  billFromEmail,
                  billFromAddress,
                  notes,
                }}
                items={items}
                currency={currency}
                subTotal={subTotal}
                taxAmount={taxAmount}
                discountAmount={discountAmount}
                total={total}
              />
              <TextField
                select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                sx={{ mt: 3, width: "100%" }}
              >
                <MenuItem value="$">USD (United States Dollar)</MenuItem>
                <MenuItem value="£">GBP (British Pound Sterling)</MenuItem>
                <MenuItem value="₹">INR (Indian Rupee)</MenuItem>
                <MenuItem value="¥">JPY (Japanese Yen)</MenuItem>
                <MenuItem value="€">EUR (Euro)</MenuItem>
              </TextField>
              <TextField
                label="Discount Rate (%)"
                type="number"
                value={discountRate}
                onChange={handleChange(setDiscountRate)}
                sx={{ mt: 3, width: "100%" }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <TextField
                label="Tax Rate (%)"
                type="number"
                value={taxRate}
                onChange={handleChange(setTaxRate)}
                sx={{ mt: 3, width: "100%" }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  Submit Invoice
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Review
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </>
  );
};
