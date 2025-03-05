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

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleData, setRoleData] = useState({ name: "", description: "" });

  // Cargar los roles al montar el componente
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener los roles:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (role = null) => {
    setEditingRole(role);
    setRoleData(role ? role : { name: "", description: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRole(null);
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        // Actualizar rol existente
        await axios.put(`${API_URL}/roles/${editingRole.id}`, roleData);
      } else {
        // Crear nuevo rol
        await axios.post(`${API_URL}/add-role`, roleData);
      }
      handleCloseDialog();
      fetchRoles(); // Recargar la lista de roles
    } catch (error) {
      console.error("Error al guardar el rol:", error.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`${API_URL}/roles/${roleId}`);
      fetchRoles(); // Recargar la lista de roles
    } catch (error) {
      console.error("Error al eliminar el rol:", error.message);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ padding: 3 }}>
        <h1>Gestión de Roles</h1>
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
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(role)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRole(role.id)}>
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

        {/* Diálogo para agregar/editar rol */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editingRole ? "Editar Rol" : "Agregar Rol"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nombre"
              name="name"
              fullWidth
              value={roleData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Descripción"
              name="description"
              fullWidth
              value={roleData.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSaveRole}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Roles;