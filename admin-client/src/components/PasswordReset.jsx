import React, { useState } from "react";
import { Button, TextField, Card, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../config";

export function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
    } else if (!email.includes("@")) {
      toast.warning("Please include '@' in your email!", { position: "top-center" });
    } else {
      const res = await fetch(`${BASE_URL}/admin/sendpasswordlink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.status === 201) {
        setEmail("");
        setMessage(true);
      } else {
        toast.error("Invalid User", { position: "top-center" });
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f9",
      }}
    >
      <Card
        style={{
          width: "400px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
        variant="outlined"
      >
        <Typography variant="h4" textAlign="center" style={{ marginBottom: "20px", fontWeight: 600 }}>
          Reset Your Password
        </Typography>

        {message && (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Password reset link sent successfully to your email.
          </Typography>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          required
          style={{ marginBottom: "20px" }}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={sendLink}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Send Reset Link
          </Button>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}
