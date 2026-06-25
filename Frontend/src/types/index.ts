// Domain Types

export interface Perfil {
  id?: number;

  nombre: string;
  apellido: string;
  email: string;

  celular?: string;
  sociedadMedica?: string;

  fechaNacimiento?: string;
  genero?: number;

  bloqueadoPorInasistencias?: boolean;
  
  twoFactorEnabled?: boolean;
  rachaAsistenciaMensual?: number;
  rol?: string;
  bloqueadoPorDeuda?: boolean;
}

export interface Cuota {
  id: number;
  estado: string;
  fechaCreacion?: string;
  fechaVencimiento?: string;
  fechaPago?: string;

  monto?: number;
  montoFinal?: number;
  importe?: number;
  descuento?: number;

  mes?: number;
  anio?: number;
  año?: number;
}

export interface Clase {
  id: number;
  grupoId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  latitud: number;
  longitud: number;
  codigoPostal: string;
  radioGeolocalizacion: number;
  esFija: boolean;
  fechaInicio: string;
  fechaFin?: string | null;
  cupoMaximo: number;
  estado: string;
  cantidadInscriptos: number;
  grupoNombre?: string;
}

export type EstadoClaseValor = 0 | 1 | 2 | 3;

export interface CambiarEstadoClaseRequest {
  estado: EstadoClaseValor;
  motivo?: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  nivel?: string;
  clases?: Clase[];
}

export interface Desafio {
  id?: number;
  desafioId?: number;

  titulo: string;
  descripcion: string;

  fechaInicio: string;
  fechaFin: string;

  participa?: boolean;
  ganador?: boolean;
  resultado?: string;
}

export interface Recompensa {
  id: number;

  tipo: string;
  descripcion: string;

  premioFisico?: string;

  beneficioId?: number;
  alumnoId?: number;

  nombre?: string;
  apellido?: string;

  leida?: boolean;
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

  asistencias?: any[];
  inasistencias?: any[];

  pagos?: any[];
  cuotas?: any[];

  [key: string]: unknown;
}

export interface Beneficio {
  id: number;

  titulo: string;
  descripcion: string;

  icono?: string;

  estado?: string;

  cuotaGratis?: boolean;

  porcentajeDescuento?: number;

  mesesAplicados?: number;
  mesesDuracion?: number;
}

export interface Alumno {
  id: number;

  nombre: string;
  apellido: string;

  email: string;

  celular?: string;

  rol?: string;

  estado?: string;
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

export interface SolicitudReactivacion {
  id: number;
  alumnoId: number;
  nombreAlumno: string;
  fechaSolicitud: string;
  estado: string;
  motivoAlumno: string;
}

export interface CrearClaseRequest {
  grupoId: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  latitud: number;
  longitud: number;
  codigoPostal: string;
  radioGeolocalizacion: number;
  esFija: boolean;
  fechaInicio: string;
  fechaFin?: string | null;
  cupoMaximo: number;
}