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

export interface Descuento {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje: number;
  mesesDuracion: number;
  tipo: string;
  alcance: string;
  activo: boolean;
  desafioId?: number | null;
}

export interface CrearDescuentoRequest {
  nombre: string;
  descripcion: string;
  porcentaje: number;
  mesesDuracion: number;
  tipo: string;
  alcance: string;
  desafioId?: number | null;
  alumnosIds: number[];
  soloPlantilla?: boolean;
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
  ubicacionNombre?: string;
  entrenadorNombre?: string;

  asistenciaRegistradaHoy?: boolean;
  fechaRegistroAsistencia?: string | null;
  tipoRegistroAsistencia?: "GEOLOCALIZACION" | "MANUAL" | string | null;
  entrenadores: string[];
entrenadoresIds: number[];
}

export type EstadoClaseValor = 0 | 1 | 2 | 3;

export interface CambiarEstadoClaseRequest {
  estado: EstadoClaseValor;
  motivo?: string;
}

export interface Auditoria {
  id: number;
  usuarioId: number;
  usuarioNombre?: string | null;
  usuarioEmail?: string | null;
  entidad: string;
  entidadId: number;
  entidadNombre?: string | null;
  accion: string;
  fecha: string;
}

export interface CuotaAdmin {
  cuotaId: number;
  alumnoId: number;
  alumnoNombre: string;
  email: string;
  mes: number;
  anio: number;
  montoBase: number;
  descuento: number;
  montoFinal: number;
  estado: string;
  fechaVencimiento?: string | null;
  fechaPago?: string | null;
  bloqueadoPorDeuda: boolean;
  bonificada: boolean;
  vencida: boolean;
}

export interface ResumenCuotasAdmin {
  totalCuotas: number;
  pendientes: number;
  pagadas: number;
  vencidas: number;
  recaudado: number;
  montoPendiente: number;
}

export interface PagoManualRequest {
  cuotaId: number;
  medioPago: number;
  referenciaExterna: string;
}

export interface InscriptoClase {
  alumnoId: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  estadoAlumno: string;
  fechaInscripcion: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  nivel: string;
  estado?: string;
  clases?: Clase[];
  cantidadClases?: number;
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

  desafioId?: number;

  tipo: string;
  descripcion: string;

  premioFisico?: string | null;

  descuentoId?: number | null;

  otorgaCuotaGratis?: boolean;

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

  sociedadMedica?: string;
  fechaNacimiento?: string;
  genero?: number;

  peso?: number;
  estatura?: number;
  imc?: number;

  rachaMensual?: number;
  rachaAsistenciaMensual?: number;
  rachaInasistencias?: number;

  bloqueadoPorInasistencias?: boolean;
  bloqueadoPorDeuda?: boolean;

  clasesInscriptas?: number;
  cantidadClasesInscripto?: number;
  cuotasPendientes?: number;

  twoFactorEnabled?: boolean;
}

export interface BeneficioPendienteAdmin {
  beneficioId: number;
  alumnoId: number;
  nombreAlumno: string;
  apellidoAlumno: string;
  descripcion: string;
  estado: string;
  mesesAplicados: number;
  mesesDuracion: number;
  cuotaGratis: boolean;
  descuento?: number | null;
}

export interface ParticipanteDesafio {
  alumnoId: number;
  nombre: string;
  apellido: string;
  resultado?: string;
  ganador: boolean;
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

  entrenadoresIds: number[];
}

export interface AlumnoAgenda {
    id:number;
    nombre:string;
    apellido:string;
}

export interface AgendaClase {
    claseId:number;

    grupo:string;

    horaInicio:string;

    horaFin:string;

    cantidadAlumnos:number;

    cupoMaximo:number;

    cuposDisponibles:number;

    alumnos:AlumnoAgenda[];
}

export interface ProximaClase{
    claseId:number;

    grupo:string;

    horaInicio:string;

    horaFin:string;
}

export type {
  DashboardEntrenador,
  ProximaClaseEntrenador,
  AgendaClaseEntrenador,
} from "./entrenadorDashboard";
