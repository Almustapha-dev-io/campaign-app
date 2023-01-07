import Layout from 'containers/Layout';
import Dashboard from 'pages/Dashboard';
import ElectionTypes from 'pages/ElectionTypes';
import Feedback from 'pages/Feedback';
import Login from 'pages/Login';
import PollingUnitData from 'pages/PollingUnitData';
import PollingUnitIssues from 'pages/PollingUnitIssues';
import Profile from 'pages/Profile';
import Roles from 'pages/Roles';
import Users from 'pages/Users';
import Vote from 'pages/Vote';
import Voters from 'pages/Voters';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<>settings</>} />
        <Route path="voters" element={<Voters />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="votes" element={<Vote />} />
        <Route path="/polling-unit-data" element={<PollingUnitData />} />
        <Route path="/polling-unit-issues" element={<PollingUnitIssues />} />
        <Route path="election-types" element={<ElectionTypes />} />
        <Route path="" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;
