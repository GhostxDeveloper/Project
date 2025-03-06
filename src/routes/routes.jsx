import React, { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LandingPage from '../pages/LandingPage/LandingPage';
import Register from '../pages/Registropage/RegistroPage';
import Grupos from '../pages/Groups.jsx/Groups';
import Roles from '../pages/Rols/Roles';
import DashboardTask from '../pages/DashboardTask/DashboardTask';
import UserManagement from '../pages/UserManagement/UserManagement';
import AssignedTasks from '../pages/AssignedTasks/AssignedTasks';

const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    // Eliminar token y sesión al entrar a login o registro
    if (location.pathname === '/login' || location.pathname === '/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [location]);

  const isTokenValid = !!localStorage.getItem('token');

  let routes = useRoutes([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <Register /> },
    {
      path: '/dashboard',
      element: isTokenValid ? <DashboardPage /> : <LoginPage />,
    },
    {
      path: '/groups',
      element: isTokenValid ? <Grupos /> : <LoginPage />,
    },
    {
      path: '/roles',
      element: isTokenValid ? <Roles /> : <LoginPage />,
    },
    {
      path: '/asignament',
      element: isTokenValid ? <DashboardTask /> : <LoginPage />,
    },
    {
      path: '/users',
      element: isTokenValid ? <UserManagement /> : <LoginPage />,
    },
    {
      path: '/assigned-tasks',
      element: isTokenValid ? <AssignedTasks /> : <LoginPage />,
    },
  ]);

  return routes;
};

export default Routes;
