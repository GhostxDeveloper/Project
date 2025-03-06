import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayouts';
import { Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchTasks, addTask, updateTask, deleteTask } from '../../services/apiService';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    timeUntilFinish: '',
    remindMe: false,
    status: 'In Progress',
    category: '',
    tag: '',
    userId: '',
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setTaskData((prevData) => ({
        ...prevData,
        userId: user.id,
      }));
      fetchTasks(user.id).then(setTasks).catch(console.error);
    }
  }, []);

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
    setTaskData(task);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setTaskToEdit(null);
    setOpenEditModal(false);
  };

  const handleSubmit = async () => {
    try {
      await addTask(taskData);
      setOpenModal(false);
      fetchTasks(user.id).then(setTasks).catch(console.error);
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateTask(taskToEdit.id, taskData);
      setOpenEditModal(false);
      fetchTasks(user.id).then(setTasks).catch(console.error);
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
      await deleteTask(taskToDelete);
      fetchTasks(user.id).then(setTasks).catch(console.error);
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  return (
    <MainLayout>
      <h1>Dashboard</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.status}</TableCell>
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
      <Fab color="primary" aria-label="add" onClick={handleOpenModal} sx={{ position: 'fixed', bottom: 20, right: 20 }}>
        <AddIcon />
      </Fab>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField label="Task Name" fullWidth margin="normal" name="name" value={taskData.name} onChange={handleChange} />
          <TextField label="Description" fullWidth margin="normal" name="description" value={taskData.description} onChange={handleChange} />
          <TextField label="Time until finish" fullWidth margin="normal" name="timeUntilFinish" value={taskData.timeUntilFinish} onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={taskData.status} onChange={handleChange}>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Category/Tag" fullWidth margin="normal" name="category" value={taskData.category} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField label="Task Name" fullWidth margin="normal" name="name" value={taskData.name} onChange={handleChange} />
          <TextField label="Description" fullWidth margin="normal" name="description" value={taskData.description} onChange={handleChange} />
          <TextField label="Time until finish" fullWidth margin="normal" name="timeUntilFinish" value={taskData.timeUntilFinish} onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={taskData.status} onChange={handleChange}>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="Revision">Revision</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Category/Tag" fullWidth margin="normal" name="category" value={taskData.category} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this task?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default DashboardPage;