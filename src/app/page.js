'use client';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import AssociateDashboard from './components/AssociateDashboard';

export default function Home() {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Login />;
  }

  if (user.role === 'manager') {
    return <ManagerDashboard />;
  }

  return <AssociateDashboard />;
}
