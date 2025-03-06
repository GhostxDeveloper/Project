import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MainLayout from '../../layouts/MainLayouts';
import { fetchUsers, fetchRoles, fetchGroups, addUser, updateUser, deleteUser } from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupMap, setGroupMap] = useState({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
    rol: '',
    groupId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsersData();
    fetchRolesData();
    fetchGroupsData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const fetchRolesData = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  const fetchGroupsData = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
      const groupMap = {};
      data.forEach(group => {
        groupMap[group.id] = group.name;
      });
      setGroupMap(groupMap);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = userData.email ? "" : "Email es requerido.";
    tempErrors.username = userData.username ? "" : "Nombre de usuario es requerido.";
    if (!editMode || userData.password) {
      tempErrors.password = userData.password ? "" : "Contraseña es requerida.";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setUserData({
      email: '',
      username: '',
      password: '',
      rol: '',
      groupId: ''
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editMode) {
          const updatedUserData = { ...userData };
          if (!userData.password) {
            delete updatedUserData.password;
          }
          await updateUser(currentUserId, updatedUserData);
        } else {
          await addUser(userData);
        }
        fetchUsersData();
        handleClose();
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setUserData({
      ...user,
      password: '' // Clear the password field
    });
    setCurrentUserId(user.id);
    setEditMode(true);
    handleOpen();
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsersData();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <MainLayout>
      <div>
        <h1>User Management</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add User
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.rol}</TableCell>
                  <TableCell>{groupMap[user.groupId]}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={userData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              name="username"
              value={userData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="rol"
                value={userData.rol}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Group</InputLabel>
              <Select
                name="groupId"
                value={userData.groupId}
                onChange={handleChange}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UserManagement;