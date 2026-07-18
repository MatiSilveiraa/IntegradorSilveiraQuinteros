import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jokitrainingapi.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url?.toLowerCase() ?? "";

    const endpointsPublicos = [
      "/api/auth/login",
      "/api/auth/solicitar-recuperacion",
      "/api/auth/restablecer-contrasena",
      "/api/auth/login-sin-password",
      "/api/auth/verificar",
      "/api/auth/google",
      "/api/alumno/registrar",
    ];

    const esEndpointPublico = endpointsPublicos.some(
      (endpoint) => url.includes(endpoint),
    );

    if (status === 401) {
      console.error("PETICIÓN 401:", {
        url: error.config?.url,
        method: error.config?.method,
        response: error.response?.data,
      });
    }

    // Solo cerrar sesión si el token realmente está vencido
    if (status === 401 && !esEndpointPublico) {
      const token = localStorage.getItem("token");

      if (token && tokenEstaVencido(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        if (window.location.pathname !== "/") {
          window.location.replace("/");
        }
      }
    }

    return Promise.reject(error);
  },
);

function tokenEstaVencido(token: string): boolean {
  try {
    const partes = token.split(".");

    if (partes.length !== 3) {
      return true;
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      decodeURIComponent(
        atob(payloadBase64)
          .split("")
          .map(
            (caracter) =>
              "%" +
              ("00" + caracter.charCodeAt(0).toString(16)).slice(-2),
          )
          .join(""),
      ),
    );

    if (!payload.exp) {
      return false;
    }

    const ahora = Math.floor(Date.now() / 1000);

    return payload.exp <= ahora;
  } catch (error) {
    console.error("No se pudo verificar el vencimiento del token:", error);

    return false;
  }
}

export default axiosInstance;