export interface GrupoEntrenador {

    id: number;

    nombre: string;

    nivel: string;

    estado: string;

    cantidadAlumnos: number;

    cantidadClases: number;

    claseId: number;

    proximoDia: string;

    proximaHoraInicio: string;

    proximaHoraFin: string;

    cupoMaximo: number;

    inscriptos: number;

    cuposDisponibles: number;
}