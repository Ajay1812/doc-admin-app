import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import dantveda from '../assets/dantveda_logo.png'
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PatientList } from './PatientsList.jsx';
import { AppointmentsList } from './AppointmentsList.jsx';
import { InvoiceForm } from './Invoice/InvoiceForm.jsx';
import { Treatments } from './Treatments.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Dantveda',
  },

  {
    segment: 'patients',
    title: 'Patients',
    icon: <PersonIcon />,
  },
  {
    segment: 'appointments',
    title: 'Appointments',
    icon: <EventNoteIcon />,
  }, {
    segment: 'treatments',
    title: "Treatments",
    icon: <MedicationLiquidOutlinedIcon />,
  }, {
    segment: "invoices",
    title: "Invoices",
    icon: <ReceiptIcon />
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  // colorSchemes: { light: true, dark: true },
  colorSchemes: { light: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  if (pathname === '/patients') {
    return <PatientList />;
  }
  if (pathname === '/appointments') {
    return <AppointmentsList />;
  }
  if (pathname === '/treatments') {
    return <Treatments />
  }
  if (pathname === '/invoices') {
    return <InvoiceForm />
  }
  if (pathname === '/dashboard' || pathname === '/') {
    return (
      <Box
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4">Welcome to the Dantveda Dashboard!</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Here you can manage patients, appointments, treatments, and invoices.
        </Typography>

        {/* Statistics Section */}
        <Box sx={{ mt: 4, display: 'flex', gap: "30px", justifyContent: 'space-around', width: '100%', flexWrap: 'wrap' }}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Total Patients</Typography>
            <Typography variant="h4">120</Typography>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Upcoming Appointments</Typography>
            <Typography variant="h4">15</Typography>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Total Treatments</Typography>
            <Typography variant="h4">50</Typography>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Pending Invoices</Typography>
            <Typography variant="h4">8</Typography>
          </Box>
        </Box>

        {/* Recent Activities Section */}
        <Box sx={{ mt: 4, width: '100%', maxWidth: '600px', textAlign: 'left' }}>
          <Typography variant="h5">Recent Activities</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }} align="left">Activity</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }} align="left">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>✔️ John Doe added as a new patient</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✔️ Appointment scheduled with Dr. Smith</TableCell>
                  <TableCell>10/30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✔️ Treatment plan updated for Jane Doe</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>✔️ Invoice generated for patient Alex Johnson</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export function Dashboard(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigator = useNavigate()

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    console.log(`Clicked on: ${item}`);
    localStorage.removeItem('token')
    toast.success("Admin Logout!", {
      position: "top-center",
      autoClose: 1000,
    });
    setTimeout(() => {
      navigator('/login')
    }, 1000)
    handleMenuClose();
  };

  return (
    <AppProvider
      branding={{
        logo: <img src={dantveda} alt="DANTVEDA logo" />,
        title: 'DANTVEDA',
      }}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick('Profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Logout')}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
      <ToastContainer />
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};
