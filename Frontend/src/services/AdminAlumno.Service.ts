import axiosInstance from "../api/axios";

export const obtenerAlumnos =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Alumno"
      );

    return response.data;
  };

export const obtenerAlumno =
  async (
    id: number
  ) => {

    const response =
      await axiosInstance.get(
        `/api/Alumno/${id}`
      );

    return response.data;
  };

export const eliminarAlumno =
  async (
    id: number
  ) => {

    const response =
      await axiosInstance.delete(
        `/api/Alumno/${id}`
      );

    return response.data;
  };