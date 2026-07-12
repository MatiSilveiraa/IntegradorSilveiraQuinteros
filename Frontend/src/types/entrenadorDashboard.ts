export interface ProximaClaseEntrenador {
  claseId: number;
  grupoId: number;
  grupo: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  fechaProximaClase: string;
  cantidadAlumnos: number;
  cupoMaximo: number;
  cuposDisponibles: number;
}

export interface AgendaClaseEntrenador {
  claseId: number;
  grupoId?: number;
  grupo: string;
  diaSemana?: string;
  horaInicio: string;
  horaFin: string;
  cantidadAlumnos: number;
  cupoMaximo?: number;
}

export interface DashboardEntrenador {
  grupos: number;
  alumnos: number;
  clasesHoy: number;
  desafiosActivos: number;
  notificacionesNoLeidas: number;
  proximaClase: ProximaClaseEntrenador | null;
  agendaHoy: AgendaClaseEntrenador[];
}
