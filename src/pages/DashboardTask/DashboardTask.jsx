import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayouts'; // Asegúrate de tener la ruta correcta del archivo MainLayout
import { Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchNewTasks, addNewTask, updateNewTask, deleteNewTask, fetchUsers, fetchGroups } from '../../services/apiService';

const DashboardTask = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Controla la apertura de la modal
  const [openEditModal, setOpenEditModal] = useState(false); // Controla la apertura del modal de edición
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Controla la apertura del diálogo de confirmación
  const [taskToDelete, setTaskToDelete] = useState(null); // Almacena la tarea a eliminar
  const [taskToEdit, setTaskToEdit] = useState(null); // Almacena la tarea a editar
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    timeUntilFinish: '',
    remindMe: false,
    status: 'In Progress',
    category: '',
    tag: '',
    userId: '',
    groupId: '',
  });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Obtener los datos del usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      fetchTasks();
      fetchUsersData();
      fetchGroupsData();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await fetchNewTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  const fetchUsersData = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const fetchGroupsData = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    }
  };

  const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.email : 'Unknown User';
  };

  const getGroupNameById = (groupId) => {
    const group = groups.find(group => group.id === groupId);
    return group ? group.name : 'Unknown Group';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setTaskData(task); // Cargar los datos de la tarea en el formulario
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setTaskToEdit(null);
    setOpenEditModal(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await addNewTask(taskData);
      console.log(response.data);
      setOpenModal(false); // Cerrar el modal después de enviar el formulario
      fetchTasks(); // Actualizar la lista de tareas
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await updateNewTask(taskToEdit.id, taskData);
      console.log(response.data);
      setOpenEditModal(false); // Cerrar el modal después de enviar el formulario
      fetchTasks(); // Actualizar la lista de tareas
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };

  const handleOpenConfirmDialog = (taskId) => {
    setTaskToDelete(taskId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setTaskToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleDelete = async () => {
    try {
      console.log(`Eliminando tarea con ID: ${taskToDelete}`);
      await deleteNewTask(taskToDelete);
      fetchTasks(); // Actualizar la lista de tareas después de eliminar una tarea
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  return (
    <MainLayout>
      <h1>Dashboard Task</h1>

      {/* Tabla de tareas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{getUserNameById(task.userId)}</TableCell>
                <TableCell>{getGroupNameById(task.groupId)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditModal(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenConfirmDialog(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleOpenModal} 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Modal con formulario para crear tarea */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
            margin="normal"
            name="name"
            value={taskData.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={taskData.description}
            onChange={handleChange}
          />
          <TextField
            label="Time until finish"
            fullWidth
            margin="normal"
            name="timeUntilFinish"
            value={taskData.timeUntilFinish}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="Revision">Revision</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Category/Tag"
            fullWidth
            margin="normal"
            name="category"
            value={taskData.category}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={taskData.userId}
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Group</InputLabel>
            <Select
              name="groupId"
              value={taskData.groupId}
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
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal con formulario para editar tarea */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
            margin="normal"
            name="name"
            value={taskData.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={taskData.description}
            onChange={handleChange}
          />
          <TextField
            label="Time until finish"
            fullWidth
            margin="normal"
            name="timeUntilFinish"
            value={taskData.timeUntilFinish}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="Revision">Revision</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Category/Tag"
            fullWidth
            margin="normal"
            name="category"
            value={taskData.category}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={taskData.userId}
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Group</InputLabel>
            <Select
              name="groupId"
              value={taskData.groupId}
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
          <Button onClick={handleCloseEditModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this task?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default DashboardTask;