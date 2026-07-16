import axiosInstance from "../api/axios";

import type { Alumno } from "../types";

export const obtenerAlumnos =
  async (): Promise<Alumno[]> => {
    const response =
      await axiosInstance.get<Alumno[]>(
        "/api/Alumno",
      );

    return response.data;
  };

export const obtenerAlumno =
  async (
    id: number,
  ): Promise<Alumno> => {
    const response =
      await axiosInstance.get<Alumno>(
        `/api/Alumno/${id}`,
      );

    return response.data;
  };

export const eliminarAlumno =
  async (
    id: number,
  ) => {
    const response =
      await axiosInstance.delete(
        `/api/Alumno/${id}`,
      );

    return response.data;
  };
