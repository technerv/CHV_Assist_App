import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CHVList from './pages/CHVs/CHVList';
import CHVCreate from './pages/CHVs/CHVCreate';
import CHVEdit from './pages/CHVs/CHVEdit';
import HouseholdList from './pages/Households/HouseholdList';
import HouseholdCreate from './pages/Households/HouseholdCreate';
import HouseholdEdit from './pages/Households/HouseholdEdit';
import MemberList from './pages/Members/MemberList';
import MemberCreate from './pages/Members/MemberCreate';
import MemberEdit from './pages/Members/MemberEdit';
import FacilityList from './pages/Facilities/FacilityList';
import FacilityCreate from './pages/Facilities/FacilityCreate';
import FacilityEdit from './pages/Facilities/FacilityEdit';
import VisitList from './pages/Visits/VisitList';
import VisitCreate from './pages/Visits/VisitCreate';
import VisitEdit from './pages/Visits/VisitEdit';
import PregnancyList from './pages/Pregnancies/PregnancyList';
import PregnancyCreate from './pages/Pregnancies/PregnancyCreate';
import PregnancyEdit from './pages/Pregnancies/PregnancyEdit';
import ReferralList from './pages/Referrals/ReferralList';
import ReferralCreate from './pages/Referrals/ReferralCreate';
import ReferralEdit from './pages/Referrals/ReferralEdit';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="chvs" element={<CHVList />} />
            <Route path="chvs/create" element={<CHVCreate />} />
            <Route path="chvs/:id/edit" element={<CHVEdit />} />
            <Route path="households" element={<HouseholdList />} />
            <Route path="households/create" element={<HouseholdCreate />} />
            <Route path="households/:id/edit" element={<HouseholdEdit />} />
            <Route path="members" element={<MemberList />} />
            <Route path="members/create" element={<MemberCreate />} />
            <Route path="members/:id/edit" element={<MemberEdit />} />
            <Route path="facilities" element={<FacilityList />} />
            <Route path="facilities/create" element={<FacilityCreate />} />
            <Route path="facilities/:id/edit" element={<FacilityEdit />} />
            <Route path="visits" element={<VisitList />} />
            <Route path="visits/create" element={<VisitCreate />} />
            <Route path="visits/:id/edit" element={<VisitEdit />} />
            <Route path="pregnancies" element={<PregnancyList />} />
            <Route path="pregnancies/create" element={<PregnancyCreate />} />
            <Route path="pregnancies/:id/edit" element={<PregnancyEdit />} />
            <Route path="referrals" element={<ReferralList />} />
            <Route path="referrals/create" element={<ReferralCreate />} />
            <Route path="referrals/:id/edit" element={<ReferralEdit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
