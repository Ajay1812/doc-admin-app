import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../config";
import { Card, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import 'react-toastify/dist/ReactToastify.css';
import { keyframes } from "@emotion/react";

export function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const adminValid = async () => {
    const res = await fetch(`${BASE_URL}/admin/forgotpassword/${id}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.status === 201) {
      console.log("Admin valid");
    } else {
      navigate("*");
    }
  };

  useEffect(() => {
    adminValid();
  }, []);

  const sendPassword = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/admin/${id}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.status == 201) {
      setPassword("");
      setMessage(true);
      toast.success("Your password has been updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000)
    } else {
      toast.error("Token expired, please generate a new link.", {
        position: "top-center",
      });
    }
  };

  const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  `;
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f9",
          animation: `${fadeIn} 0.8s ease`,
        }}
      >
        <Card
          style={{
            width: "400px",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
            animation: `${fadeIn} 0.8s ease`,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            textAlign="center"
            variant="h4"
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
              animation: `${fadeIn} 1s ease`,
            }}
          >
            Reset Your Password
          </Typography>
          {message && (
            <Typography
              style={{
                color: "green",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "15px",
                animation: `${fadeIn} 1.2s ease`,
              }}
            >
              Password successfully updated!
            </Typography>
          )}

          <TextField
            type={showPassword ? "text" : "password"}
            label="New Password"
            placeholder="Enter your new password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            style={{
              animation: `${fadeIn} 1.2s ease`,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />} {/* Toggle icon */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={sendPassword}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#1976d2",
                color: "#fff",
                animation: `${fadeIn} 1.4s ease`,
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              Update Password
            </Button>
          </div>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
}
