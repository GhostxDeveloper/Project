import React, { useState, useEffect } from "react";
import {
  Box,
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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayouts";
import { fetchAssignedTasks, updateNewTaskStatus } from "../../services/apiService";

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      loadTasks(user.id, user.group); // Cargar todas las tareas del grupo
    }
  }, []);

  const loadTasks = async (userId, groupId) => {
    try {
      const data = await fetchAssignedTasks(userId, groupId); // Obtener todas las tareas del grupo
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar las tareas asignadas:", error.message);
    }
  };

  const handleEditClick = (task) => {
    if (task.userId === user.id) { // Solo permitir edición si la tarea pertenece al usuario
      setCurrentTask(task);
      setStatus(task.status);
      setOpen(true);
    } else {
      alert("No puedes editar esta tarea.");
    }
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
    if (currentTask) {
      try {
        await updateNewTaskStatus(currentTask.id, status);
        loadTasks(user.id, user.group); // Recargar tareas del grupo después de actualizar el estado
        handleClose();
      } catch (error) {
        console.error("Error al actualizar el estado de la tarea:", error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "#d4edda"; // Verde claro
      case "In Progress":
        return "#fff3cd"; // Naranja
      case "Paused":
        return "#f8d7da"; // Rojo
      default:
        return "#ffffff"; // Blanco
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <MainLayout>
      <Box sx={{ padding: 3 }}>
        <h1>Mis Tareas Asignadas</h1>
        {Object.keys(groupedTasks).length > 0 ? (
          <Grid container spacing={2}>
            {Object.keys(groupedTasks).map((status) => (
              <Grid item xs={12} key={status}>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  {status}
                </Typography>
                <Grid container spacing={2}>
                  {groupedTasks[status].map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Card sx={{ backgroundColor: getStatusColor(task.status) }}>
                        <CardContent>
                          <Typography variant="h6">{task.name}</Typography>
                          <Typography variant="body2">{formatDate(task.timeUntilFinish)}</Typography>
                          {/* Verifica si la tarea pertenece al usuario para habilitar la edición */}
                          {task.userId === user.id && (
                            <IconButton onClick={() => handleEditClick(task)}>
                              <EditIcon />
                            </IconButton>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
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
