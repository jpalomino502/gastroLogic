// frontend/src/services/authService.js

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.user;
    } else {
      throw new Error(data.error || "Error al iniciar sesión");
    }
  } catch (error) {
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const register = async (name, restaurantName, email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, restaurantName, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.user;
    } else {
      throw new Error(data.error || "Error al registrar el usuario");
    }
  } catch (error) {
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      return true; // Cierre de sesión exitoso
    } else {
      throw new Error("Error al cerrar sesión");
    }
  } catch (error) {
    throw error;
  }
};