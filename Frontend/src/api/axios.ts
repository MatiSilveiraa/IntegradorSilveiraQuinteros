import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jokitrainingapi.azurewebsites.net",
});

export default axiosInstance;