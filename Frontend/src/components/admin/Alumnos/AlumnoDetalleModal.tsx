import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import type { Alumno } from "../../../types";

type Props = {
  alumno: Alumno | null;
  onCerrar: () => void;
};

export default function AlumnoDetalleModal({
  alumno,
  onCerrar,
}: Props) {
  if (!alumno) return null;

  const clases = obtenerClasesConfiables(alumno);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Cerrar detalle del alumno"
        onClick={onCerrar}
        className="absolute inset-0"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle-alumno"
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 shadow-2xl sm:p-7"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 text-2xl font-bold text-[#4adea8]">
              {iniciales(alumno)}
            </div>

            <div className="min-w-0">
              <h2
                id="titulo-detalle-alumno"
                className="break-words text-2xl font-bold sm:text-3xl"
              >
                {alumno.nombre} {alumno.apellido}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-400">
                {alumno.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2d463b] bg-[#12201b] text-gray-400 transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <CloseOutlinedIcon />
          </button>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DatoDetalle
            titulo="Racha mensual"
            valor={String(obtenerRacha(alumno))}
          />

          <DatoDetalle
            titulo="Cuotas pendientes"
            valor={String(obtenerCuotasPendientes(alumno))}
          />

          <DatoDetalle
            titulo="Clases inscriptas"
            valor={clases === null ? "No disponible" : String(clases)}
          />

          <DatoDetalle
            titulo="Estado"
            valor={alumno.estado ?? "Sin estado"}
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <SeccionDetalle titulo="Información personal">
            <FilaDetalle titulo="Nombre" valor={alumno.nombre} />
            <FilaDetalle titulo="Apellido" valor={alumno.apellido} />
            <FilaDetalle titulo="Email" valor={alumno.email} />
            <FilaDetalle
              titulo="Celular"
              valor={alumno.celular ?? "No registrado"}
            />
            <FilaDetalle
              titulo="Fecha de nacimiento"
              valor={formatearFecha(alumno.fechaNacimiento)}
            />
            <FilaDetalle
              titulo="Género"
              valor={obtenerGeneroTexto(alumno.genero)}
            />
          </SeccionDetalle>

          <SeccionDetalle titulo="Salud">
            <FilaDetalle
              titulo="Sociedad médica"
              valor={alumno.sociedadMedica ?? "No registrada"}
            />
            <FilaDetalle
              titulo="Peso"
              valor={
                alumno.peso
                  ? `${formatearNumero(alumno.peso)} kg`
                  : "No registrado"
              }
            />
            <FilaDetalle
              titulo="Estatura"
              valor={
                alumno.estatura
                  ? `${formatearNumero(alumno.estatura, 2)} m`
                  : "No registrada"
              }
            />
            <FilaDetalle
              titulo="IMC"
              valor={formatearNumero(alumno.imc)}
            />
          </SeccionDetalle>

          <SeccionDetalle titulo="Bloqueos">
            <FilaDetalle
              titulo="Por deuda"
              valor={alumno.bloqueadoPorDeuda ? "Sí" : "No"}
            />
            <FilaDetalle
              titulo="Por inasistencias"
              valor={
                alumno.bloqueadoPorInasistencias ? "Sí" : "No"
              }
            />
          </SeccionDetalle>

          <SeccionDetalle titulo="Seguridad">
            <FilaDetalle
              titulo="Autenticación en dos pasos"
              valor={
                alumno.twoFactorEnabled
                  ? "Activada"
                  : "Desactivada"
              }
            />
          </SeccionDetalle>
        </div>
      </section>
    </div>
  );
}

function DatoDetalle({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      <p className="text-xs text-gray-500">{titulo}</p>
      <p className="mt-2 text-2xl font-bold">{valor}</p>
    </div>
  );
}

function SeccionDetalle({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-5">
      <h3 className="mb-4 text-xl font-bold">{titulo}</h3>
      <div className="space-y-3 text-sm">{children}</div>
    </section>
  );
}

function FilaDetalle({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string | number | undefined;
}) {
  return (
    <p>
      <span className="text-gray-400">{titulo}:</span>{" "}
      <strong>{valor ?? "No registrado"}</strong>
    </p>
  );
}

function obtenerRacha(alumno: Alumno) {
  return (
    alumno.rachaAsistenciaMensual ??
    alumno.rachaMensual ??
    0
  );
}

function obtenerClasesConfiables(alumno: Alumno) {
  if (typeof alumno.clasesInscriptas === "number") {
    return alumno.clasesInscriptas;
  }

  if (typeof alumno.cantidadClasesInscripto === "number") {
    return alumno.cantidadClasesInscripto;
  }

  return null;
}

function obtenerCuotasPendientes(alumno: Alumno) {
  return alumno.cuotasPendientes ?? 0;
}

function iniciales(alumno: Alumno) {
  return `${alumno.nombre?.charAt(0) ?? ""}${
    alumno.apellido?.charAt(0) ?? ""
  }`.toUpperCase();
}

function obtenerGeneroTexto(genero?: number) {
  if (genero === 0) return "Masculino";
  if (genero === 1) return "Femenino";
  if (genero === 2) return "Otro";
  return "No especificado";
}

function formatearFecha(fecha?: string) {
  if (!fecha) return "No registrada";

  return new Date(fecha).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Montevideo",
  });
}

function formatearNumero(
  valor?: number,
  decimales = 1,
) {
  if (valor === undefined || valor === null) {
    return "No registrado";
  }

  return valor.toFixed(decimales);
}
