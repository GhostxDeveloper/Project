import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  Fab,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayouts";

const API_URL = "http://localhost:3000"; // Cambia esta URL si tu backend corre en otro puerto o dominio

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupData, setGroupData] = useState({ name: "", description: "" });

  // Cargar los grupos al montar el componente
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error("Error al obtener los grupos:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (group = null) => {
    setEditingGroup(group);
    setGroupData(group ? group : { name: "", description: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGroup(null);
  };

  const handleSaveGroup = async () => {
    try {
      if (editingGroup) {
        // Actualizar grupo existente
        await axios.put(`${API_URL}/groups/${editingGroup.id}`, groupData);
      } else {
        // Crear nuevo grupo
        await axios.post(`${API_URL}/add-group`, groupData);
      }
      handleCloseDialog();
      fetchGroups(); // Recargar la lista de grupos
    } catch (error) {
      console.error("Error al guardar el grupo:", error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`${API_URL}/groups/${groupId}`);
      fetchGroups(); // Recargar la lista de grupos
    } catch (error) {
      console.error("Error al eliminar el grupo:", error.message);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ padding: 3 }}>
        <h1>Gestión de Grupos</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(group)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteGroup(group.id)}>
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
          onClick={() => handleOpenDialog()}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
          }}
        >
          <AddIcon />
        </Fab>

        {/* Diálogo para agregar/editar grupo */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editingGroup ? "Editar Grupo" : "Agregar Grupo"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nombre"
              name="name"
              fullWidth
              value={groupData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Descripción"
              name="description"
              fullWidth
              value={groupData.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSaveGroup}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Groups;