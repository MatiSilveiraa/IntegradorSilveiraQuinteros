export interface AlumnoGrupo {
  id: number;
  nombre: string;
  apellido: string;
  peso?: number;
  estatura?: number;
  imc?: number;
  bloqueado: boolean;
}

export interface ClaseGrupo {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  inscriptos: number;
  activa: boolean;
  entrenadores: string[];
entrenadoresIds: number[];
}

export interface GrupoDetalle {
  id: number;
  nombre: string;
  nivel: string;
  estado: string;
  cantidadAlumnos: number;
  cantidadClases: number;
  alumnos: AlumnoGrupo[];
  clases: ClaseGrupo[];
}