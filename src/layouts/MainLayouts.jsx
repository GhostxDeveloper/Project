import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemText } from '@mui/material';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.rol);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <h1>Dashboard</h1>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          {role === 'User' && (
            <ListItem button component={Link} to="/assigned-tasks">
              <ListItemText primary="Mis Tareas Asignadas" />
            </ListItem>
          )}
          {role === 'Master' && (
            <>
              <ListItem button component={Link} to="/assigned-tasks">
                <ListItemText primary="Mis Tareas Asignadas" />
              </ListItem>
              <ListItem button component={Link} to="/groups">
                <ListItemText primary="Grupos" />
              </ListItem>
              <ListItem button component={Link} to="/roles">
                <ListItemText primary="Roles" />
              </ListItem>
              <ListItem button component={Link} to="/asignament">
                <ListItemText primary="Asignar Tareas" />
              </ListItem>
              <ListItem button component={Link} to="/users">
                <ListItemText primary="Usuarios" />
              </ListItem>
            </>
          )}
          {role === 'Admin' && (
            <>
              <ListItem button component={Link} to="/groups">
                <ListItemText primary="Grupos" />
              </ListItem>
              <ListItem button component={Link} to="/asignament">
                <ListItemText primary="Asignar Tareas" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Box
        sx={{
          marginLeft: `${drawerWidth}px`,
          padding: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          marginTop: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;