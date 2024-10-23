import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

export function NotFound() {
  return (
    <div style={styles.container}>
      <Typography variant="h1" style={styles.heading}>
        404
      </Typography>
      <Typography variant="h6" style={styles.subheading}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Link to="/login" style={styles.link}>
        <Button variant="contained" color="primary">
          Go Back to Login
        </Button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "center",
    height: "100vh",
    textAlign: 'center',
    marginTop: '100px',
  },
  heading: {
    fontSize: '20rem',
    color: '#333',
  },
  subheading: {
    fontSize: "2rem",
    marginBottom: '40px',
  },
  link: {
    textDecoration: 'none',
  },
};
