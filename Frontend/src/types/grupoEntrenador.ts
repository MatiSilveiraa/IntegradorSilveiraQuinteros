export interface GrupoEntrenador {
  id: number;
  nombre: string;
  nivel: string;
  estado: string;
  cantidadAlumnos: number;
  cantidadClases: number;
  claseId: number | null;
  proximoDia: string | null;
  proximaHoraInicio: string | null;
  proximaHoraFin: string | null;
  fechaProximaClase: string | null;
  cupoMaximo: number | null;
  inscriptos: number | null;
  cuposDisponibles: number | null;
}
