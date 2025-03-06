import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/apiService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(email, password); // Llamas a tu servicio de login
      console.log('Respuesta del servidor:', data);

      if (data.token) {
        // Aquí ya tienes el token en data.token, puedes almacenarlo si lo necesitas
        console.log('Token generado:', data.token); 
        localStorage.setItem('token', data.token);  // Guardamos el token en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));  // Guardamos el usuario en localStorage
        alert('Inicio de sesión exitoso');
        navigate('/dashboard');  // Navegas a la página de dashboard o la que necesites
      } else {
        alert('No se encontraron los datos del usuario');
      }
    } catch (error) {
      setError('Credenciales incorrectas: ' + error.message);  // Manejo de error
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
          Iniciar Sesión
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
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Iniciar Sesión
          </Button>
        </form>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/register')}
        >
          Registrarse
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
