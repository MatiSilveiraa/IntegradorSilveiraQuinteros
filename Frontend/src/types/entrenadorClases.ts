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
  grupoId: number;
  grupo: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
  cupoMaximo: number;
  cantidadAlumnos: number;
  cantidadEntrenadores: number;
  tieneConflictoHorario: boolean;
  latitud: number;
  longitud: number;
  codigoPostal: string;
  radioGeolocalizacion: number;
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
