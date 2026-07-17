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

    if (status === 401 && !esEndpointPublico) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;