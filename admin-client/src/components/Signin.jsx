import { Card, Typography, TextField, Button, Grid, InputAdornment, IconButton, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import dantveda from "../assets/dantveda.jpg";
import { keyframes } from "@emotion/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Login Failed!", {
          position: "top-center",
          autoClose: 1000,
        });
        setError(errorData.message || "Login failed");
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000)
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  `;

  const imageSlideIn = keyframes`
    0% { opacity: 0; transform: translateX(-50px); }
    100% { opacity: 1; transform: translateX(0); }
  `;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f9",
          animation: `${fadeIn} 0.8s ease`,
          background: "#FFFDF2"
        }}
      >
        <Card
          style={{
            width: "80%",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
            borderRadius: "12px",
            overflow: "hidden",
            animation: `${fadeIn} 0.8s ease`,
          }}
        >
          <Grid container>
            {/* Left side - Doctor's Image */}
            <Grid
              item
              xs={12}
              md={6}
              style={{
                backgroundColor: "#f0f0f0",
                animation: `${imageSlideIn} 1s ease-out`,
              }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={dantveda}
                  alt="Doctor"
                  style={{
                    width: "100%",
                    borderRadius: "15px",
                    objectFit: "cover",
                    height: "100%",
                  }}
                />
              </div>
            </Grid>

            {/* Right side - SignIn Form */}
            <Grid
              item
              xs={12}
              md={6}
              style={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  animation: `${fadeIn} 1.2s ease`,
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{ marginBottom: "20px", fontWeight: 600 }}
                >
                  Welcome to Dantveda!
                </Typography>

                {/* Display error message */}
                {error && (
                  <Typography color="error" style={{ marginBottom: "10px" }}>
                    {error}
                  </Typography>
                )}

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  style={{ animation: `${fadeIn} 1s ease` }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  style={{ animation: `${fadeIn} 1.2s ease` }}
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
                <br />
                <Link style={{ fontFamily: "sans-serif" }} href="/password-reset">Forgot Password</Link>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleSignIn}
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    animation: `${fadeIn} 1.4s ease`,
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Sign In
                </Button>
                <br />
                <span> Don't have an account <a href="/signup">Signup</a></span>
              </div>
            </Grid>
          </Grid>
        </Card>
      </div >
      <ToastContainer />
    </>
  );
}
