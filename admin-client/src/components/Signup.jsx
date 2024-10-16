import { Card, Typography, TextField, Button, Grid, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import dantveda from "../assets/dantveda.jpg";
import { keyframes } from "@emotion/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSignUp = () => {
    fetch(`${BASE_URL}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    }).then((res) => {
      res.json().then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/login");
      });
    });
  };

  const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  `;

  const imageSlideIn = keyframes`
    0% { opacity: 0; transform: translateX(-50px); }
    100% { opacity: 1; transform: translateX(0); }
  `;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#FFFDF2",
        animation: `${fadeIn} 0.8s ease`,
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

          {/* Right side - Signup Form */}
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
              <Typography variant="h4" gutterBottom style={{ marginBottom: "20px", fontWeight: 600 }}>
                Welcome to Dantveda!
              </Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                style={{ animation: `${fadeIn} 1s ease` }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                style={{ animation: `${fadeIn} 1.2s ease` }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)} // Toggle the state
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />} {/* Change icon based on state */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ animation: `${fadeIn} 1.4s ease` }}
              />
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  animation: `${fadeIn} 1.6s ease`,
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
                Sign Up
              </Button>
              <br />
              <span> Already have an account <a href="/login">Login</a></span>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
