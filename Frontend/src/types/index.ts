// Domain Types

export interface Perfil {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  twoFactorEnabled?: boolean;
  rachaAsistenciaMensual?: number;
  rol?: string;
}

export interface Cuota {
  id: number;
  estado: string;
  fechaCreacion?: string;
  fechaVencimiento?: string;
  monto?: number;
  mes?: number;
  año?: number;
}

export interface Clase {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo?: number;
  grupoId?: number;
}

export interface Grupo {
  id: number;
  nombre: string;
  nivel?: string;
  clases?: Clase[];
}

export interface Desafio {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface Recompensa {
  id: number;
  tipo: string;
  descripcion: string;
  premioFisico?: string;
}

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  fechaCreacion: string;
  leida: boolean;
}

export interface Historial {
  id?: number;
  alumnoId?: number;
  asistencias?: number;
  inasistencias?: number;
  [key: string]: unknown;
}

export interface Beneficio {
  id: number;
  titulo: string;
  descripcion: string;
  icono?: string;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  rol?: string;
}

export interface ApiError {
  response?: {
    data?: {
      mensaje?: string;
    };
    status?: number;
  };
  message?: string;
}
