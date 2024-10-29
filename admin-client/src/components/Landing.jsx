import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container, Grid, Paper } from '@mui/material';
import landing from "../assets/landing.jpg";
import { useNavigate } from 'react-router-dom';
function LandingPage() {
  const navigate = useNavigate('')
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🦷 Dantveda Admin
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
          <Button color="inherit" onClick={() => navigate("/signup")}>Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={landing}
                alt="Doctor illustration"
                sx={{
                  width: '65%',
                  borderRadius: 2,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom>
                Manage Your Practice Efficiently
              </Typography>
              <Typography variant="h5" color="textSecondary" paragraph>
                Our platform provides an all-in-one solution for managing patient records, appointments, invoices, and more.
              </Typography>
              <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }} onClick={() => navigate("/login")}>
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Patient Management
              </Typography>
              <Typography color="textSecondary">
                Easily manage patient records, appointments, and treatment history in one place.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Scheduling
              </Typography>
              <Typography color="textSecondary">
                Schedule and manage appointments with a user-friendly interface.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Invoice Management
              </Typography>
              <Typography color="textSecondary">
                Keep track of invoices and payments efficiently and securely.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ backgroundColor: '#e0e0e0', py: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Transform Your Practice?
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Join Us Now
        </Button>
      </Box>
    </div >
  );
}

export default LandingPage;
