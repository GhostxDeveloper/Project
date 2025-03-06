import axios from 'axios';

const API_URL = "http://localhost:3000";

// Auth Services
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Task Services
export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    throw error;
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/add-task`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la tarea:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
};

// User Services
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/add-user`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

// Group Services
export const fetchGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    throw error;
  }
};

export const addGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_URL}/add-group`, groupData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el grupo:", error);
    throw error;
  }
};

export const updateGroup = async (groupId, groupData) => {
  try {
    const response = await axios.put(`${API_URL}/groups/${groupId}`, groupData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el grupo:", error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(`${API_URL}/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el grupo:", error);
    throw error;
  }
};

// Role Services
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error;
  }
};

export const addRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/add-role`, roleData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el rol:", error);
    throw error;
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    throw error;
  }
};

// New Task Services
export const fetchNewTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/new-tasks`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las nuevas tareas:", error);
    throw error;
  }
};

export const addNewTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/new-add-task`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la nueva tarea:", error);
    throw error;
  }
};

export const updateNewTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/new-tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la nueva tarea:", error);
    throw error;
  }
};

export const updateNewTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(`${API_URL}/new-tasks/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado de la nueva tarea:", error);
    throw error;
  }
};

export const deleteNewTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/new-tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la nueva tarea:", error);
    throw error;
  }
};

export const fetchAssignedTasks = async (userId, groupId) => {
  try {
    const response = await axios.get(`${API_URL}/assigned-tasks/${userId}/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas asignadas:", error);
    throw error;
  }
};