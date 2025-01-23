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