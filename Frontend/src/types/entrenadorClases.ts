export interface ClaseAsignadaEntrenador {
  claseId: number;
  grupoId: number;
  grupo: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
  esPrincipal: boolean;
  cantidadEntrenadores: number;
  cantidadAlumnos: number;
  cupoMaximo: number;
}

export interface ClaseDisponibleEntrenador {
  claseId: number;
  grupo: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cantidadEntrenadores: number;
  tieneConflictoHorario: boolean;
}

export interface ConflictoHorarioEntrenador {
  entrenadorId: number;
  claseId: number;
  grupo: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface ConflictoUnirseClaseResponse {
  requiereConfirmacion: true;
  mensaje: string;
  conflictos: ConflictoHorarioEntrenador[];
}

export interface MensajeApiResponse {
  mensaje: string;
}
