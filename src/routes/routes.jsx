import { useRoutes } from 'react-router-dom';
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LandingPage from "../pages/LandingPage/LandingPage"
import Register from '../pages/Registropage/RegistroPage';
import Grupos from '../pages/Groups.jsx/Groups';
import Roles from '../pages/Rols/Roles';
import DashboardTask from '../pages/DashboardTask/DashboardTask';
import UserManagement from '../pages/UserManagement/UserManagement';
import AssignedTasks from '../pages/AssignedTasks/AssignedTasks';

const Routes = () => {
  let routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/register", element: <Register /> },
    { path: "/groups", element: <Grupos /> },
    { path: "/roles", element: <Roles /> },
    { path: "/asignament", element: <DashboardTask /> },
    { path: "/users", element: <UserManagement /> },
    {path : "/assigned-tasks", element: <AssignedTasks />}

  ]);
  return routes;
}

export default Routes;