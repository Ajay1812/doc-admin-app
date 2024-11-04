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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config.js';

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

function DemoPageContent({ pathname, addActivity, recentActivities }) {
  if (pathname === '/patients') {
    return <PatientList addActivity={addActivity} />;
  }
  if (pathname === '/appointments') {
    return <AppointmentsList addActivity={addActivity} />;
  }
  if (pathname === '/treatments') {
    return <Treatments addActivity={addActivity} />
  }
  if (pathname === '/invoices') {
    return <InvoiceForm addActivity={addActivity} />
  }
  if (pathname === '/dashboard' || pathname === '/') {
    const [patients, setPatients] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([])
    const [totalTreatment, setTotalTreatment] = useState([])
    useEffect(() => {
      const fetchPatients = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/admin/patients`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setPatients(response.data.patients);
        } catch (err) {
          console.log(err)
        }
      };

      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/admin/appointments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const currentDate = new Date();
          const upcomingAppointments = response.data.appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);
            return appointmentDate > currentDate;
          });
          // console.log(`Upcoming appointments count: ${upcomingAppointments.length}`);
          setUpcomingAppointments(upcomingAppointments)
        } catch (error) {
          console.log(error);
        }
      };
      const fetchTreatments = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/admin/treatments`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          // console.log("TREATMENT: ", response.data)
          setTotalTreatment(response.data);
        } catch (error) {
          console.error("Error fetching treatments:", error);
        }
      };
      fetchTreatments()
      fetchAppointments()
      fetchPatients();
    }, []);
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
        <Box sx={{ mt: 4, display: 'flex', gap: "30px", padding: "20px", justifyContent: 'space-around', width: '100%', flexWrap: 'wrap' }}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Total Patients</Typography>
            <Typography variant="h4">{patients.length}</Typography>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Upcoming Appointments</Typography>
            <Typography variant="h4">{upcomingAppointments.length}</Typography>
          </Box>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
            <Typography variant="h6">Total Treatments</Typography>
            <Typography variant="h4">{totalTreatment.length}</Typography>
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
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.activity}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">No recent activities.</TableCell>
                  </TableRow>
                )}
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
  addActivity: PropTypes.func.isRequired,
  recentActivities: PropTypes.array.isRequired,
};

export function Dashboard(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigator = useNavigate()
  const [recentActivities, setRecentActivities] = useState([]);
  const addActivity = (activity) => {
    setRecentActivities((prevActivities) => [
      ...prevActivities,
      { activity, date: new Date().toLocaleString() },
    ]);
  };

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
        <DemoPageContent pathname={pathname} addActivity={addActivity} recentActivities={recentActivities} />
      </DashboardLayout>
      <ToastContainer />
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};
