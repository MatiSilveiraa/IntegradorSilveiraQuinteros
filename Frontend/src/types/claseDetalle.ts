export interface AlumnoClase {

    id: number;

    nombre: string;

    apellido: string;

    presente: boolean;

}

export interface ClaseDetalle {

    id: number;

    grupoId: number;

    grupo: string;

    diaSemana: string;

    horaInicio: string;

    horaFin: string;

    cupoMaximo: number;

    inscriptos: number;

    cuposDisponibles: number;

    latitud: number;

    longitud: number;

    codigoPostal: string;

    radio: number;

    alumnos: AlumnoClase[];

}

export interface AlumnoClase {
  id: number;
  nombre: string;
  apellido: string;
  presente: boolean;
}