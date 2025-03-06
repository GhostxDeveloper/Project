import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../services/apiService';

const RegistroPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !username || !password) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor, introduce un email válido.');
      return;
    }
    try {
      const response = await addUser({ email, username, password, rol: 'User' });
      setMessage(response.message);
    } catch (error) {
      setMessage('Error al registrar el usuario: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Registro de Usuario
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {message && (
            <Typography color="error" variant="body2">
              {message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Registrar
          </Button>
        </form>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </Button>
      </Box>
    </Container>
  );
};

export default RegistroPage;