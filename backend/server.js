import dotenv from 'dotenv';
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; 
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Cargar las variables de entorno
dotenv.config();

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
});
const db = getFirestore(app);

const saltRounds = 10;
const secretKey = 'keysalvador2505'; // Este también debe estar en el archivo .env si lo deseas.

const router = express.Router();
const server = express();
server.use(bodyParser.json());
server.use(cors());
server.use(router);

server.listen(process.env.PORT || 3000, () => {
  console.log('✅ Servidor Express corriendo...');
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Intentando iniciar sesión con email: ${email}`);

    const usersCollection = collection(db, "Users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Usuario no encontrado.");
      return res.status(401).send("Usuario no encontrado.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log(`Usuario encontrado: ${userData.email}`);

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    console.log(`Contraseña válida: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log("Contraseña incorrecta.");
      return res.status(401).send("Contraseña incorrecta.");
    }

    // Actualiza la fecha del último inicio de sesión
    await updateDoc(doc(db, "Users", userDoc.id), {
      last_login: new Date(),
    });

    // Genera el token JWT
    const token = jwt.sign(
      { id: userDoc.id, email: userData.email, role: userData.rol }, 
      secretKey, 
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,  // Envía el token JWT en la respuesta
      user: {
        id: userDoc.id,
        email: userData.email,
        username: userData.username,
        rol: userData.rol,
        group: userData.groupId 
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error al iniciar sesión: " + error.message);
  }
});

server.post("/add-task", async (req, res) => {
  try {
    const { name, description, timeUntilFinish, remindMe, status, category, tag, userId } = req.body;

    const docRef = await addDoc(collection(db, "Tasks"), {
      name,
      description,
      timeUntilFinish,
      remindMe,
      status,
      category,
      tag,
      userId,
      created_at: new Date(),
    });

    res.status(200).send("Tarea agregada exitosamente con ID: " + docRef.id);
  } catch (error) {
    res.status(500).send("Error al agregar la tarea: " + error.message);
  }
});

server.get("/tasks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasksCollection = collection(db, "Tasks");
    const q = query(tasksCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send("Error al obtener las tareas: " + error.message);
  }
});

server.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, description, timeUntilFinish, remindMe, status, category, tag, userId } = req.body;

    const taskRef = doc(db, "Tasks", taskId);
    await updateDoc(taskRef, {
      name,
      description,
      timeUntilFinish,
      remindMe,
      status,
      category,
      tag,
      userId,
      updated_at: new Date(),
    });

    res.status(200).send("Tarea actualizada exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar la tarea: " + error.message);
  }
});

server.delete("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    await deleteDoc(doc(db, "Tasks", taskId));
    res.status(200).send("Tarea eliminada exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar la tarea: " + error.message);
  }
});



//documentar el codigo apartir de aqui 


server.post("/add-user", async (req, res) => {
  try {
    const { email, username, password, rol = '', groupId = '' } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await addDoc(collection(db, "Users"), {
      email,
      username,
      password: hashedPassword,
      last_login: null,
      rol,
      groupId,
    });

    res.status(200).send("Usuario agregado exitosamente con ID: " + docRef.id);
  } catch (error) {
    res.status(500).send("Error al agregar el usuario: " + error.message);
  }
});

server.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, username, password, rol, groupId } = req.body;

    const userRef = doc(db, "Users", userId);
    const updateData = { email, username, rol, groupId };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await updateDoc(userRef, updateData);

    res.status(200).send("Usuario actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar el usuario: " + error.message);
  }
});

server.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await deleteDoc(doc(db, "Users", userId));
    res.status(200).send("Usuario eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar el usuario: " + error.message);
  }
});




server.post("/add-group", async (req, res) => {
  try {
    const { name, description } = req.body;

    const docRef = await addDoc(collection(db, "Groups"), {
      name,
      description,
      created_at: new Date(),
    });

    res.status(200).send("Grupo agregado exitosamente con ID: " + docRef.id);
  } catch (error) {
    res.status(500).send("Error al agregar el grupo: " + error.message);
  }
});

server.get("/groups", async (req, res) => {
  try {
    const groupsCollection = collection(db, "Groups");
    const querySnapshot = await getDocs(groupsCollection);

    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).send("Error al obtener los grupos: " + error.message);
  }
});

server.put("/groups/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;

    const groupRef = doc(db, "Groups", groupId);
    await updateDoc(groupRef, {
      name,
      description,
      updated_at: new Date(),
    });

    res.status(200).send("Grupo actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar el grupo: " + error.message);
  }
});

server.delete("/groups/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    await deleteDoc(doc(db, "Groups", groupId));
    res.status(200).send("Grupo eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar el grupo: " + error.message);
  }
});

// Agregar un rol
server.post("/add-role", async (req, res) => {
  try {
    const { name, description } = req.body;

    const docRef = await addDoc(collection(db, "Roles"), {
      name,
      description,
      created_at: new Date(),
    });

    res.status(200).send("Rol agregado exitosamente con ID: " + docRef.id);
  } catch (error) {
    res.status(500).send("Error al agregar el rol: " + error.message);
  }
});

// Obtener todos los roles
server.get("/roles", async (req, res) => {
  try {
    const rolesCollection = collection(db, "Roles");
    const querySnapshot = await getDocs(rolesCollection);

    const roles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).send("Error al obtener los roles: " + error.message);
  }
});

// Actualizar un rol
server.put("/roles/:roleId", async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description } = req.body;

    const roleRef = doc(db, "Roles", roleId);
    await updateDoc(roleRef, {
      name,
      description,
      updated_at: new Date(),
    });

    res.status(200).send("Rol actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar el rol: " + error.message);
  }
});

// Eliminar un rol
server.delete("/roles/:roleId", async (req, res) => {
  try {
    const { roleId } = req.params;

    await deleteDoc(doc(db, "Roles", roleId));
    res.status(200).send("Rol eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar el rol: " + error.message);
  }
});
server.post("/new-add-task", async (req, res) => {
  try {
    const { name, description, timeUntilFinish, remindMe, status, category, tag, userId, groupId } = req.body;

    const docRef = await addDoc(collection(db, "Tasks2"), {
      name,
      description,
      timeUntilFinish,
      remindMe,
      status,
      category,
      tag,
      userId,
      groupId,
      created_at: new Date(),
    });

    res.status(200).send("Tarea agregada exitosamente con ID: " + docRef.id);
  } catch (error) {
    res.status(500).send("Error al agregar la tarea: " + error.message);
  }
});

server.get("/new-tasks", async (req, res) => {
  try {
    const tasksCollection = collection(db, "Tasks2");
    const querySnapshot = await getDocs(tasksCollection);

    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send("Error al obtener las tareas: " + error.message);
  }
});

server.put("/new-tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, description, timeUntilFinish, remindMe, status, category, tag, userId, groupId } = req.body;

    const taskRef = doc(db, "Tasks2", taskId);
    await updateDoc(taskRef, {
      name,
      description,
      timeUntilFinish,
      remindMe,
      status,
      category,
      tag,
      userId,
      groupId,
      updated_at: new Date(),
    });

    res.status(200).send("Tarea actualizada exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar la tarea: " + error.message);
  }
});

server.put("/new-tasks/:taskId/status", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const taskRef = doc(db, "Tasks2", taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return res.status(404).send("Tarea no encontrada");
    }

    await updateDoc(taskRef, {
      status,
      updated_at: new Date(),
    });

    res.status(200).send("Estado de la tarea actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error al actualizar el estado de la tarea: " + error.message);
  }
});

server.delete("/new-tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    await deleteDoc(doc(db, "Tasks2", taskId));
    res.status(200).send("Tarea eliminada exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar la tarea: " + error.message);
  }
});
server.get("/users", async (req, res) => {
  try {
    const usersCollection = collection(db, "Users");
    const querySnapshot = await getDocs(usersCollection);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios: " + error.message);
  }
});

server.get("/groups", async (req, res) => {
  try {
    const groupsCollection = collection(db, "Groups");
    const querySnapshot = await getDocs(groupsCollection);

    const groups = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).send("Error al obtener los grupos: " + error.message);
  }
});
server.get("/assigned-tasks/:userId/:groupId", async (req, res) => {
  try {
    const { userId, groupId } = req.params;
    const tasksCollection = collection(db, "Tasks2");
    const q = query(tasksCollection, where("userId", "==", userId), where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send("Error al obtener las tareas asignadas: " + error.message);
  }
});

const checkConnection = async () => {
  try {
    const docRef = doc(db, "test-collection", "test-doc");
    await getDoc(docRef);

    console.log("Conexión exitosa a la base de datos.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

checkConnection();