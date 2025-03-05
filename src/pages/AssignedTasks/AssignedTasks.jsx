import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayouts";

const API_URL = "http://localhost:3000"; // Cambia esta URL si tu backend corre en otro puerto o dominio

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [status, setStatus] = useState("");

  // Cargar los datos del usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      console.log("storedUser", storedUser);
      fetchTasks(user.id, user.group);
    }
  }, []);

  const fetchTasks = async (userId, groupId) => {
    try {
      const response = await axios.get(`${API_URL}/assigned-tasks/${userId}/${groupId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas asignadas:", error.message);
    }
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setStatus(task.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
    setStatus("");
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`${API_URL}/new-tasks/${currentTask.id}/status`, { status });
      fetchTasks(user.id, user.group);
      handleClose();
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '' : date.toLocaleDateString();
  };

  return (
    <MainLayout>
      <Box sx={{ padding: 3 }}>
        <h1>Mis Tareas Asignadas</h1>
        {tasks.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha de Finalización</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{formatDate(task.timeUntilFinish)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(task)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            No tienes tareas asignadas por el momento.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Actualizar Estado de la Tarea</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select value={status} onChange={handleStatusChange}>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateStatus} color="primary">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AssignedTasks;