import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5211",
});

export default axiosInstance;