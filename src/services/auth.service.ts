
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  company: string;
}

const USERS_KEY = 'sst_users';
const SESSION_KEY = 'sst_session';

const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (
  userData: Omit<User, 'id'>
): { success: boolean; message: string } => {
  const users = getUsers();

  const email = userData.email.trim().toLowerCase();

  const existingUser = users.find(
    user => user.email.toLowerCase() === email
  );

  if (existingUser) {
    return {
      success: false,
      message: 'Este correo ya está registrado.',
    };
  }

  const newUser: User = {
    ...userData,
    email,
    id: crypto.randomUUID(),
  };

  users.push(newUser);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return {
    success: true,
    message: 'Usuario registrado correctamente.',
  };
};

export const loginUser = (
  email: string,
  password: string,
  rememberSession: boolean
): { success: boolean; message: string } => {
  const users = getUsers();

  const user = users.find(
    item =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: 'Correo o contraseña incorrectos.',
    };
  }

  const session = {
    userId: user.id,
    email: user.email,
  };

  // Limpiar sesiones anteriores.
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);

  const storage = rememberSession ? localStorage : sessionStorage;

  storage.setItem(SESSION_KEY, JSON.stringify(session));

  return {
    success: true,
    message: 'Inicio de sesión exitoso.',
  };
};

export const getCurrentUser = (): User | null => {
  const sessionData =
    localStorage.getItem(SESSION_KEY) ??
    sessionStorage.getItem(SESSION_KEY);

  if (!sessionData) return null;

  const session = JSON.parse(sessionData) as {
    userId: string;
    email: string;
  };

  const users = getUsers();

  return users.find(user => user.id === session.userId) ?? null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};
