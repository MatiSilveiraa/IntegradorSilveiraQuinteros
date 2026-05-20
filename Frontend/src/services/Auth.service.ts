import axios from "axios";

const API_URL =
  "http://localhost:5211/api";

export const register = async (
  usuario: any
) => {

  const response = await axios.post(
    `${API_URL}/alumno/registrar`,
    usuario
  );

  return response.data;

};

export const login = async (
  email: string,
  password: string
) => {

  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  return response.data;

};