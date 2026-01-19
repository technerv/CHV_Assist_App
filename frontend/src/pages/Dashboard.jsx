import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Paper,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Home as HomeIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  PregnantWoman as PregnantWomanIcon,
  Send as SendIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import api from '../services/api';

const StatCard = ({ icon, title, value, color, onClick }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        bgcolor: alpha(color, 0.1),
        border: `1px solid ${alpha(color, 0.3)}`,
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: color,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const QuickActionCard = ({ icon, title, description, color, onClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Avatar sx={{ bgcolor: color, width: 64, height: 64, mx: 'auto', mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    chvs: 0,
    households: 0,
    members: 0,
    facilities: 0,
    visits: 0,
    pregnancies: 0,
    referrals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [chvsRes, householdsRes, membersRes, facilitiesRes, visitsRes, pregnanciesRes, referralsRes] = await Promise.all([
          api.get('/chvs/'),
          api.get('/households/'),
          api.get('/members/'),
          api.get('/facilities/'),
          api.get('/visits/'),
          api.get('/pregnancies/'),
          api.get('/referrals/'),
        ]);

        setStats({
          chvs: chvsRes.data.count || chvsRes.data.length || 0,
          households: householdsRes.data.count || householdsRes.data.length || 0,
          members: membersRes.data.count || membersRes.data.length || 0,
          facilities: facilitiesRes.data.count || facilitiesRes.data.length || 0,
          visits: visitsRes.data.count || visitsRes.data.length || 0,
          pregnancies: pregnanciesRes.data.count || pregnanciesRes.data.length || 0,
          referrals: referralsRes.data.count || referralsRes.data.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      icon: <PeopleIcon />,
      title: 'Add CHV',
      description: 'Register a new Community Health Volunteer',
      color: theme.palette.primary.main,
      path: '/chvs/create',
    },
    {
      icon: <HomeIcon />,
      title: 'Add Household',
      description: 'Register a new household',
      color: theme.palette.secondary.main,
      path: '/households/create',
    },
    {
      icon: <PeopleIcon />,
      title: 'Add Member',
      description: 'Register a new community member',
      color: theme.palette.success.main,
      path: '/members/create',
    },
    {
      icon: <HospitalIcon />,
      title: 'Add Facility',
      description: 'Register a new healthcare facility',
      color: theme.palette.error.main,
      path: '/facilities/create',
    },
    {
      icon: <AssignmentIcon />,
      title: 'Record Visit',
      description: 'Record a CHV visit',
      color: theme.palette.warning.main,
      path: '/visits/create',
    },
    {
      icon: <PregnantWomanIcon />,
      title: 'Add Pregnancy',
      description: 'Register a new pregnancy',
      color: theme.palette.info.main,
      path: '/pregnancies/create',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Community Health Volunteer Management System - Kenya
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="CHVs"
            value={stats.chvs}
            color={theme.palette.primary.main}
            onClick={() => navigate('/chvs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<HomeIcon />}
            title="Households"
            value={stats.households}
            color={theme.palette.secondary.main}
            onClick={() => navigate('/households')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Members"
            value={stats.members}
            color={theme.palette.success.main}
            onClick={() => navigate('/members')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<HospitalIcon />}
            title="Facilities"
            value={stats.facilities}
            color={theme.palette.error.main}
            onClick={() => navigate('/facilities')}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <QuickActionCard
                icon={action.icon}
                title={action.title}
                description={action.description}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
            <TrendingUpIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              About CHV Management System
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Empowering Community Health Volunteers across all 47 counties in Kenya to deliver
              quality healthcare services to communities. This system supports comprehensive
              management of CHVs, households, members, facilities, visits, pregnancies, and referrals.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Dashboard;
