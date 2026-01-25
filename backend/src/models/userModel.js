/**
 * Modelo de Usuario
 * Gestiona el almacenamiento y operaciones de usuarios en archivo JSON
 * Soporta usuarios locales y usuarios de GitHub OAuth
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ruta al archivo de datos de usuarios
const DATA_FILE = path.join(__dirname, '../../data/users.json');

/**
 * Asegura que el directorio y archivo de datos existan
 */
const ensureDataFile = () => {
  const dataDir = path.dirname(DATA_FILE);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('[UserModel] Directorio de datos creado:', dataDir);
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
    console.log('[UserModel] Archivo de usuarios creado:', DATA_FILE);
  }
};

/**
 * Lee todos los usuarios del archivo JSON
 */
const readUsers = () => {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[UserModel] Error al leer usuarios:', error.message);
    return { users: [] };
  }
};

/**
 * Guarda los usuarios en el archivo JSON
 */
const saveUsers = (data) => {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('[UserModel] Error al guardar usuarios:', error.message);
    return false;
  }
};

/**
 * Obtiene todos los usuarios
 */
exports.getAll = () => {
  const data = readUsers();
  return data.users;
};

/**
 * Busca un usuario por ID
 */
exports.findById = (id) => {
  const data = readUsers();
  return data.users.find(user => user.id === id);
};

/**
 * Busca un usuario por email
 */
exports.findByEmail = (email) => {
  const data = readUsers();
  return data.users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Busca un usuario por GitHub ID
 */
exports.findByGithubId = (githubId) => {
  const data = readUsers();
  return data.users.find(user => user.githubId === githubId);
};

/**
 * Crea un nuevo usuario (autenticación local)
 */
exports.create = (userData) => {
  const data = readUsers();
  
  const newUser = {
    id: uuidv4(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    provider: 'local',
    createdAt: new Date().toISOString(),
    lastLogin: null
  };

  data.users.push(newUser);
  saveUsers(data);
  
  console.log('[UserModel] Usuario local creado:', newUser.email);
  return newUser;
};

/**
 * Actualiza la fecha del último login
 */
exports.updateLastLogin = (id) => {
  const data = readUsers();
  const userIndex = data.users.findIndex(user => user.id === id);
  
  if (userIndex !== -1) {
    data.users[userIndex].lastLogin = new Date().toISOString();
    saveUsers(data);
    return true;
  }
  
  return false;
};

/**
 * Crea un nuevo usuario desde GitHub OAuth
 */
exports.createGithubUser = (githubData) => {
  const data = readUsers();
  
  const newUser = {
    id: uuidv4(),
    email: githubData.email.toLowerCase(),
    githubId: githubData.githubId,
    githubUsername: githubData.githubUsername,
    name: githubData.name,
    avatarUrl: githubData.avatarUrl,
    provider: 'github',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  data.users.push(newUser);
  saveUsers(data);
  
  console.log('[UserModel] Usuario de GitHub creado:', newUser.githubUsername);
  return newUser;
};

/**
 * Vincula una cuenta de GitHub a un usuario existente
 */
exports.linkGithubAccount = (userId, githubData) => {
  const data = readUsers();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    data.users[userIndex] = {
      ...data.users[userIndex],
      githubId: githubData.githubId,
      githubUsername: githubData.githubUsername,
      avatarUrl: githubData.avatarUrl,
      name: githubData.name || data.users[userIndex].name,
      lastLogin: new Date().toISOString()
    };
    saveUsers(data);
    console.log('[UserModel] Cuenta de GitHub vinculada:', githubData.githubUsername);
    return data.users[userIndex];
  }
  
  return null;
};

/**
 * Actualiza información de GitHub del usuario
 */
exports.updateGithubInfo = (userId, githubData) => {
  const data = readUsers();
  const userIndex = data.users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    data.users[userIndex] = {
      ...data.users[userIndex],
      githubUsername: githubData.githubUsername || data.users[userIndex].githubUsername,
      avatarUrl: githubData.avatarUrl || data.users[userIndex].avatarUrl,
      name: githubData.name || data.users[userIndex].name
    };
    saveUsers(data);
    return data.users[userIndex];
  }
  
  return null;
};

/**
 * Elimina un usuario por ID
 */
exports.delete = (id) => {
  const data = readUsers();
  const initialLength = data.users.length;
  data.users = data.users.filter(user => user.id !== id);
  
  if (data.users.length < initialLength) {
    saveUsers(data);
    return true;
  }
  
  return false;
};

/**
 * Actualiza un usuario
 */
exports.update = (id, updates) => {
  const data = readUsers();
  const userIndex = data.users.findIndex(user => user.id === id);
  
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    saveUsers(data);
    return data.users[userIndex];
  }
  
  return null;
};

// Inicializar archivo de datos al cargar el módulo
ensureDataFile();
