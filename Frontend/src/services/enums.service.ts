import axios from "axios";

const API_URL =
  "http://localhost:5211/api/enums";

export const obtenerGeneros =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/generos`
      );

    return response.data;
};