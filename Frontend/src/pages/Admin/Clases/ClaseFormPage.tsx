import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../../components/FullScreenSpinner";
import ClassLocationMap from "../../../components/maps/ClassLocationMap";
import ConflictoEntrenadoresModal from "../../../components/ui/ConflictoEntrenadoresModal";

import { obtenerGrupos } from "../../../services/Grupo.Service";
import {
  crearClase,
  editarClase,
  obtenerClasePorId,
} from "../../../services/Clase.Service";

import type {
  ConflictoAsignacionClaseResponse,
  CrearClaseRequest,
  Grupo,
} from "../../../types";
import {
  obtenerEntrenadores,
  type EntrenadorSelector,
} from "../../../services/Admin.Service";

type HorarioClase = {
  horaInicio: string;
  horaFin: string;
};

type DiaConHorarios = {
  diaSemana: number;
  horarios: HorarioClase[];
};

type TipoClase = "puntual" | "recurrente";

type OperacionGuardado = {
  id?: number;
  request: CrearClaseRequest;
};

type ConflictoPendiente = {
  operacion: OperacionGuardado;
  restantes: OperacionGuardado[];
  respuesta: ConflictoAsignacionClaseResponse;
};

export default function ClaseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const grupoIdDesdeUrl = searchParams.get("grupoId");

  const esEdicion = Boolean(id);

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorSelector[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [confirmandoConflicto, setConfirmandoConflicto] = useState(false);
  const [conflictoPendiente, setConflictoPendiente] =
    useState<ConflictoPendiente | null>(null);

  const [tipoClase, setTipoClase] = useState<TipoClase>("recurrente");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [cantidadInscriptos, setCantidadInscriptos] = useState(0);

  const [horarioPuntual, setHorarioPuntual] = useState<HorarioClase>({
    horaInicio: "",
    horaFin: "",
  });

  const [diasConHorarios, setDiasConHorarios] = useState<DiaConHorarios[]>([
    {
      diaSemana: 0,
      horarios: [{ horaInicio: "", horaFin: "" }],
    },
  ]);

  const [form, setForm] = useState<CrearClaseRequest>({
    grupoId: grupoIdDesdeUrl ? Number(grupoIdDesdeUrl) : 0,
    diaSemana: 0,
    horaInicio: "",
    horaFin: "",
    latitud: -32.3667,
    longitud: -54.1833,
    codigoPostal: "",
    radioGeolocalizacion: 100,
    esFija: true,
    fechaInicio: "",
    fechaFin: null,
    cupoMaximo: 20,
    entrenadoresIds: [],
    entrenadorPrincipalId: 0,
    forzarAsignacion: false,
  });

  const grupoSeleccionadoDesdeUrl = grupos.find(
    (g) => g.id === Number(grupoIdDesdeUrl),
  );

  const inputClass =
    "w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]";

  // IMPORTANTE:
  // Estos valores siguen el enum DiaSemana del backend:
  // Lunes = 0, Martes = 1, Miércoles = 2, Jueves = 3,
  // Viernes = 4, Sábado = 5 y Domingo = 6.
  const diasSemana = [
    { valor: 0, nombre: "Lunes" },
    { valor: 1, nombre: "Martes" },
    { valor: 2, nombre: "Miércoles" },
    { valor: 3, nombre: "Jueves" },
    { valor: 4, nombre: "Viernes" },
    { valor: 5, nombre: "Sábado" },
    { valor: 6, nombre: "Domingo" },
  ];

  const nombreDia = (dia: number) =>
    diasSemana.find((d) => d.valor === dia)?.nombre ?? "";

  const convertirDiaANumero = (dia: string) => {
    const dias: Record<string, number> = {
      Lunes: 0,
      Martes: 1,
      Miércoles: 2,
      Miercoles: 2,
      Jueves: 3,
      Viernes: 4,
      Sábado: 5,
      Sabado: 5,
      Domingo: 6,
    };

    return dias[dia] ?? 0;
  };

  // Calcula el día sin depender de la zona horaria y lo convierte
  // al enum usado por el backend:
  // JS: Domingo=0 ... Sábado=6
  // Backend: Lunes=0 ... Domingo=6
  const obtenerDiaDesdeFecha = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("-").map(Number);

    if (!anio || !mes || !dia) {
      return -1;
    }

    const diaJavaScript = new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay();

    return (diaJavaScript + 6) % 7;
  };

  const formatearHora = (hora: string) => {
    if (!hora) return "";
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const obtenerNombreGrupo = () => {
    const grupo = grupos.find((g) => g.id === form.grupoId);
    return grupo?.nombre ?? "Sin grupo";
  };

  const hayHorariosIncompletos = (horarios: HorarioClase[]) =>
    horarios.some((h) => !h.horaInicio || !h.horaFin);

  const hayHorariosInvalidos = (horarios: HorarioClase[]) =>
    horarios.some(
      (h) => h.horaInicio && h.horaFin && h.horaInicio >= h.horaFin,
    );

  const hayHorariosDuplicados = (horarios: HorarioClase[]) => {
    const completos = horarios.filter((h) => h.horaInicio && h.horaFin);

    const claves = completos.map((h) => `${h.horaInicio}-${h.horaFin}`);

    return new Set(claves).size !== claves.length;
  };

  const hayHorariosSolapados = (horarios: HorarioClase[]) => {
    const completos = horarios
      .filter((h) => h.horaInicio && h.horaFin)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    for (let i = 1; i < completos.length; i++) {
      const anterior = completos[i - 1];
      const actual = completos[i];

      if (actual.horaInicio < anterior.horaFin) {
        return true;
      }
    }

    return false;
  };

  const obtenerErrorHorarios = (horarios: HorarioClase[]) => {
    if (hayHorariosIncompletos(horarios)) {
      return "Completá todos los horarios.";
    }

    if (hayHorariosInvalidos(horarios)) {
      return "La hora de inicio debe ser menor a la hora de fin.";
    }

    if (hayHorariosDuplicados(horarios)) {
      return "Hay horarios duplicados.";
    }

    if (hayHorariosSolapados(horarios)) {
      return "Hay horarios superpuestos.";
    }

    return "";
  };

  const errorHorarioPuntual = useMemo(
    () => obtenerErrorHorarios([horarioPuntual]),
    [horarioPuntual],
  );

  const erroresPorDia = useMemo(() => {
    const errores: Record<number, string> = {};

    diasConHorarios.forEach((dia, index) => {
      errores[index] = obtenerErrorHorarios(dia.horarios);
    });

    return errores;
  }, [diasConHorarios]);

  const hayErroresEnHorarios =
    tipoClase === "puntual"
      ? Boolean(errorHorarioPuntual)
      : Object.values(erroresPorDia).some(Boolean);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const gruposData = await obtenerGrupos();
        setGrupos(gruposData);
        const entrenadoresData = await obtenerEntrenadores();
        setEntrenadores(entrenadoresData);

        if (esEdicion && id) {
          const clase = await obtenerClasePorId(Number(id));
          const diaNumero = convertirDiaANumero(clase.diaSemana);

          setTipoClase(clase.esFija ? "recurrente" : "puntual");
          setCantidadInscriptos(clase.cantidadInscriptos ?? 0);

          setHorarioPuntual({
            horaInicio: clase.horaInicio?.substring(0, 5) ?? "",
            horaFin: clase.horaFin?.substring(0, 5) ?? "",
          });

          setDiasConHorarios([
            {
              diaSemana: diaNumero,
              horarios: [
                {
                  horaInicio: clase.horaInicio?.substring(0, 5) ?? "",
                  horaFin: clase.horaFin?.substring(0, 5) ?? "",
                },
              ],
            },
          ]);

          setForm({
            grupoId: grupoIdDesdeUrl ? Number(grupoIdDesdeUrl) : clase.grupoId,
            diaSemana: diaNumero,
            horaInicio: clase.horaInicio?.substring(0, 5) ?? "",
            horaFin: clase.horaFin?.substring(0, 5) ?? "",
            latitud: clase.latitud,
            longitud: clase.longitud,
            codigoPostal: clase.codigoPostal ?? "",
            radioGeolocalizacion: clase.radioGeolocalizacion,
            esFija: clase.esFija,
            fechaInicio: clase.fechaInicio?.substring(0, 10) ?? "",
            fechaFin: clase.fechaFin ? clase.fechaFin.substring(0, 10) : null,
            cupoMaximo: clase.cupoMaximo,

            entrenadoresIds:
              clase.entrenadoresIds ??
              (clase.entrenadorPrincipalId
                ? [clase.entrenadorPrincipalId]
                : []),
            entrenadorPrincipalId:
              clase.entrenadorPrincipalId ?? clase.entrenadoresIds?.[0] ?? 0,
            forzarAsignacion: false,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [esEdicion, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ||
        name === "grupoId" ||
        name === "cupoMaximo" ||
        name === "latitud" ||
        name === "longitud" ||
        name === "radioGeolocalizacion"
          ? Number(value)
          : value,
    }));
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fechaElegida = e.target.value;

    // Nunca corregimos ni desplazamos automáticamente la fecha elegida.
    // Si hay una incompatibilidad real, se informa al guardar.
    setForm((prev) => ({
      ...prev,
      fechaInicio: fechaElegida,
    }));
  };

  const cambiarTipoClase = (tipo: TipoClase) => {
    setTipoClase(tipo);

    setForm((prev) => ({
      ...prev,
      esFija: tipo === "recurrente",
      fechaFin: tipo === "puntual" ? null : prev.fechaFin,
    }));
  };

  const agregarDia = () => {
    const usados = diasConHorarios.map((d) => d.diaSemana);
    const disponible = diasSemana.find((d) => !usados.includes(d.valor));

    if (!disponible) {
      toast.error("Ya agregaste todos los días");
      return;
    }

    setDiasConHorarios((prev) => [
      ...prev,
      {
        diaSemana: disponible.valor,
        horarios: [{ horaInicio: "", horaFin: "" }],
      },
    ]);
  };

  const eliminarDia = (index: number) => {
    if (diasConHorarios.length === 1) {
      toast.error("Debe haber al menos un día configurado");
      return;
    }

    setDiasConHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  const cambiarDia = (index: number, diaSemana: number) => {
    const yaExiste = diasConHorarios.some(
      (dia, i) => dia.diaSemana === diaSemana && i !== index,
    );

    if (yaExiste) {
      toast.error("Ese día ya está configurado");
      return;
    }

    setDiasConHorarios((prev) =>
      prev.map((dia, i) =>
        i === index
          ? {
              ...dia,
              diaSemana,
            }
          : dia,
      ),
    );
  };

  const agregarHorarioADia = (diaIndex: number) => {
    setDiasConHorarios((prev) =>
      prev.map((dia, i) =>
        i === diaIndex
          ? {
              ...dia,
              horarios: [...dia.horarios, { horaInicio: "", horaFin: "" }],
            }
          : dia,
      ),
    );
  };

  const eliminarHorarioDeDia = (diaIndex: number, horarioIndex: number) => {
    setDiasConHorarios((prev) =>
      prev.map((dia, i) => {
        if (i !== diaIndex) return dia;

        if (dia.horarios.length === 1) {
          toast.error("Cada día debe tener al menos un horario");
          return dia;
        }

        return {
          ...dia,
          horarios: dia.horarios.filter((_, h) => h !== horarioIndex),
        };
      }),
    );
  };

  const cambiarHorarioDeDia = (
    diaIndex: number,
    horarioIndex: number,
    campo: keyof HorarioClase,
    valor: string,
  ) => {
    setDiasConHorarios((prev) =>
      prev.map((dia, i) =>
        i === diaIndex
          ? {
              ...dia,
              horarios: dia.horarios.map((horario, h) =>
                h === horarioIndex
                  ? {
                      ...horario,
                      [campo]: valor,
                    }
                  : horario,
              ),
            }
          : dia,
      ),
    );
  };

  const validarFormulario = () => {
    if (!form.grupoId) {
      toast.error("Seleccioná un grupo");
      return false;
    }

    if (!form.fechaInicio) {
      toast.error(
        tipoClase === "puntual"
          ? "Ingresá la fecha de la clase"
          : "Ingresá la fecha de inicio",
      );
      return false;
    }

    if (form.cupoMaximo <= 0) {
      toast.error("El cupo máximo debe ser mayor a 0");
      return false;
    }

    if (esEdicion && form.cupoMaximo < cantidadInscriptos) {
  toast.error(
    `El cupo no puede ser menor a ${cantidadInscriptos} porque ya hay alumnos inscriptos.`,
  );

  return false;
}

    if (!form.entrenadorPrincipalId) {
      toast.error("Seleccioná al menos un entrenador");
      return false;
    }

    if (
      !form.entrenadorPrincipalId ||
      !form.entrenadoresIds.includes(form.entrenadorPrincipalId)
    ) {
      toast.error(
        "Seleccioná un entrenador principal entre los entrenadores asignados",
      );
      return false;
    }

    if (hayErroresEnHorarios) {
      toast.error("Corregí los errores de horarios antes de guardar");
      return false;
    }

    if (tipoClase === "recurrente") {
      if (!esEdicion) {
        const diasValidos = diasConHorarios.map((d) => d.diaSemana);

        const diaDeLaFecha = obtenerDiaDesdeFecha(form.fechaInicio);

        if (diaDeLaFecha === -1) {
          toast.error("La fecha de inicio no es válida");
          return false;
        }

        if (!diasValidos.includes(diaDeLaFecha)) {
          const diasConfigurados = diasValidos
            .map(nombreDia)
            .filter(Boolean)
            .join(", ");

          toast.error(
            `La fecha seleccionada corresponde a ${nombreDia(
              diaDeLaFecha,
            )}, pero los días configurados son: ${diasConfigurados}. La fecha no fue modificada.`,
          );
          return false;
        }
      }

      if (form.fechaFin && form.fechaFin < form.fechaInicio) {
        toast.error(
          "La fecha de fin no puede ser anterior a la fecha de inicio",
        );
        return false;
      }
    }

    return true;
  };

  const formatearFechaParaApi = (fecha: string) =>
    fecha ? `${fecha}T00:00:00` : "";

  const armarRequest = (
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
  ): CrearClaseRequest => ({
    ...form,

    entrenadoresIds: [
      form.entrenadorPrincipalId,
      ...form.entrenadoresIds.filter(
        (id) => id !== 0 && id !== form.entrenadorPrincipalId,
      ),
    ],
    entrenadorPrincipalId: form.entrenadorPrincipalId,

    diaSemana,
    esFija: tipoClase === "recurrente",
    horaInicio: formatearHora(horaInicio),
    horaFin: formatearHora(horaFin),
    fechaInicio: formatearFechaParaApi(form.fechaInicio),
    fechaFin:
      tipoClase === "recurrente" && form.fechaFin
        ? formatearFechaParaApi(form.fechaFin)
        : null,
    forzarAsignacion: false,
  });

  const esConflictoConfirmable = (
    error: any,
  ): error is {
    response: {
      status: number;
      data: ConflictoAsignacionClaseResponse;
    };
  } =>
    error?.response?.status === 409 &&
    error?.response?.data?.requiereConfirmacion === true;

  const ejecutarOperacion = async (
    operacion: OperacionGuardado,
    forzarAsignacion = false,
  ) => {
    const request: CrearClaseRequest = {
      ...operacion.request,
      forzarAsignacion,
    };

    if (operacion.id !== undefined) {
      return editarClase(operacion.id, request);
    }

    return crearClase(request);
  };

  const finalizarGuardado = (cantidadOperaciones: number) => {
    toast.success(
      esEdicion
        ? "Clase actualizada correctamente"
        : cantidadOperaciones === 1
          ? "Clase creada correctamente"
          : `${cantidadOperaciones} clases creadas correctamente`,
    );

    if (grupoIdDesdeUrl) {
      navigate(`/admin/grupos/${grupoIdDesdeUrl}`);
      return;
    }

    navigate("/admin/clases");
  };

  const procesarOperaciones = async (
    operaciones: OperacionGuardado[],
    totalOriginal: number,
  ) => {
    for (let indice = 0; indice < operaciones.length; indice++) {
      const operacion = operaciones[indice];

      try {
        await ejecutarOperacion(operacion);
      } catch (error: any) {
        if (esConflictoConfirmable(error)) {
          setConflictoPendiente({
            operacion,
            restantes: operaciones.slice(indice + 1),
            respuesta: error.response.data,
          });

          return;
        }

        throw error;
      }
    }

    finalizarGuardado(totalOriginal);
  };

  const construirOperaciones = (): OperacionGuardado[] => {
    if (esEdicion && id) {
      const dia =
        tipoClase === "puntual"
          ? obtenerDiaDesdeFecha(form.fechaInicio)
          : diasConHorarios[0].diaSemana;

      const horario =
        tipoClase === "puntual"
          ? horarioPuntual
          : diasConHorarios[0].horarios[0];

      return [
        {
          id: Number(id),
          request: armarRequest(dia, horario.horaInicio, horario.horaFin),
        },
      ];
    }

    if (tipoClase === "puntual") {
      return [
        {
          request: armarRequest(
            obtenerDiaDesdeFecha(form.fechaInicio),
            horarioPuntual.horaInicio,
            horarioPuntual.horaFin,
          ),
        },
      ];
    }

    return diasConHorarios.flatMap((dia) =>
      dia.horarios.map((horario) => ({
        request: armarRequest(
          dia.diaSemana,
          horario.horaInicio,
          horario.horaFin,
        ),
      })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const operaciones = construirOperaciones();

    try {
      setGuardando(true);
      await procesarOperaciones(operaciones, operaciones.length);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Guardar clase]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ?? "No se pudo guardar la clase",
      );
    } finally {
      setGuardando(false);
    }
  };

  const cancelarConflicto = () => {
    if (confirmandoConflicto) return;
    setConflictoPendiente(null);
  };

  const confirmarConflicto = async () => {
    if (!conflictoPendiente) return;

    const { operacion, restantes } = conflictoPendiente;

    try {
      setConfirmandoConflicto(true);

      await ejecutarOperacion(operacion, true);

      setConflictoPendiente(null);

      if (restantes.length > 0) {
        await procesarOperaciones(restantes, construirOperaciones().length);
      } else {
        finalizarGuardado(construirOperaciones().length);
      }
    } catch (error: any) {
      if (esConflictoConfirmable(error)) {
        setConflictoPendiente({
          operacion,
          restantes,
          respuesta: error.response.data,
        });

        return;
      }

      if (!error?.response || error.response.status >= 500) {
        console.error("[Confirmar conflicto de entrenadores]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ?? "No se pudo guardar la clase",
      );
    } finally {
      setConfirmandoConflicto(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  const cantidadClasesACrear =
    tipoClase === "puntual"
      ? 1
      : diasConHorarios.reduce((total, dia) => total + dia.horarios.length, 0);

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {esEdicion
              ? "Editar clase"
              : grupoIdDesdeUrl && grupoSeleccionadoDesdeUrl
                ? `Nueva clase para ${grupoSeleccionadoDesdeUrl.nombre}`
                : "Nueva clase"}
          </h1>

          <p className="text-gray-400 mt-2">
            {esEdicion
              ? "Modificá únicamente los datos que necesites. El grupo y el tipo de clase se mantienen asociados."
              : grupoIdDesdeUrl
                ? "La clase quedará asociada automáticamente al grupo seleccionado."
                : "Configurá la información general de la clase."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 space-y-6"
        >
          {esEdicion && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
              <h2 className="text-blue-300 font-bold">Modo edición</h2>
              <p className="text-sm text-gray-300 mt-2">
                Podés cambiar la ubicación, el cupo, el radio, las fechas o el
                horario sin volver a configurar el grupo.
              </p>
            </div>
          )}
          {!esEdicion && grupoIdDesdeUrl && grupoSeleccionadoDesdeUrl && (
            <div className="bg-[#12201b] border border-[#4adea8]/30 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-[#4adea8] font-bold">
                Grupo seleccionado
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {grupoSeleccionadoDesdeUrl.nombre}
              </h2>

              <p className="text-gray-400 mt-2">
                Nivel{" "}
                <span className="text-white font-semibold">
                  {grupoSeleccionadoDesdeUrl.nivel}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-3">
                La clase quedará asociada automáticamente a este grupo.
              </p>
            </div>
          )}

          <div>
            <label className="block mb-3 text-sm text-gray-300">
              Tipo de clase
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => !esEdicion && cambiarTipoClase("puntual")}
                disabled={esEdicion}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  esEdicion ? "cursor-not-allowed opacity-75 " : ""
                }${
                  tipoClase === "puntual"
                    ? "border-[#4adea8] bg-[#4adea8]/10"
                    : "border-[#2d463b] bg-[#12201b]"
                }`}
              >
                <h3 className="font-bold">Clase puntual</h3>

                <p className="text-sm text-gray-400 mt-2">
                  Se dicta una sola vez en una fecha específica.
                </p>
              </button>

              <button
                type="button"
                onClick={() => !esEdicion && cambiarTipoClase("recurrente")}
                disabled={esEdicion}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  esEdicion ? "cursor-not-allowed opacity-75 " : ""
                }${
                  tipoClase === "recurrente"
                    ? "border-[#4adea8] bg-[#4adea8]/10"
                    : "border-[#2d463b] bg-[#12201b]"
                }`}
              >
                <h3 className="font-bold">Clase recurrente</h3>

                <p className="text-sm text-gray-400 mt-2">
                  Se repite semanalmente uno o varios días.
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Grupo</label>

            {esEdicion || grupoIdDesdeUrl ? (
              <div className="w-full p-4 rounded-xl bg-[#12201b] border border-[#2d463b]">
                <p className="font-semibold text-white">
                  {obtenerNombreGrupo()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  El grupo ya está asociado a esta clase y no necesita volver a
                  seleccionarse.
                </p>
              </div>
            ) : (
              <select
                name="grupoId"
                value={form.grupoId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={0}>Seleccionar grupo</option>

                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {tipoClase === "puntual" ? (
            <div>
              <label className="block mb-3 text-sm text-gray-300">
                Horario
              </label>

              <div className="grid md:grid-cols-2 gap-4 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                <input
                  type="time"
                  value={horarioPuntual.horaInicio}
                  onChange={(e) =>
                    setHorarioPuntual((prev) => ({
                      ...prev,
                      horaInicio: e.target.value,
                    }))
                  }
                  className={inputClass}
                />

                <input
                  type="time"
                  value={horarioPuntual.horaFin}
                  onChange={(e) =>
                    setHorarioPuntual((prev) => ({
                      ...prev,
                      horaFin: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              {errorHorarioPuntual && (
                <p className="mt-2 text-sm text-red-400">
                  ⚠ {errorHorarioPuntual}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-300">
                    Días y horarios
                  </label>

                  <p className="text-xs text-gray-500 mt-1">
                    Configurá horarios distintos para cada día.
                  </p>
                </div>

                {!esEdicion && (
                  <button
                    type="button"
                    onClick={agregarDia}
                    className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] hover:border-[#4adea8]"
                  >
                    + Agregar día
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {diasConHorarios.map((dia, diaIndex) => (
                  <div
                    key={diaIndex}
                    className={`bg-[#12201b] border rounded-2xl p-5 space-y-4 ${
                      erroresPorDia[diaIndex]
                        ? "border-red-500/50"
                        : "border-[#2d463b]"
                    }`}
                  >
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block mb-2 text-sm text-gray-300">
                          Día
                        </label>

                        <select
                          value={dia.diaSemana}
                          onChange={(e) =>
                            cambiarDia(diaIndex, Number(e.target.value))
                          }
                          disabled={esEdicion}
                          className={inputClass}
                        >
                          {diasSemana.map((d) => (
                            <option key={d.valor} value={d.valor}>
                              {d.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {!esEdicion && (
                        <button
                          type="button"
                          onClick={() => eliminarDia(diaIndex)}
                          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:border-red-400"
                        >
                          Eliminar día
                        </button>
                      )}
                    </div>

                    {dia.horarios.map((horario, horarioIndex) => (
                      <div
                        key={horarioIndex}
                        className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
                      >
                        <input
                          type="time"
                          value={horario.horaInicio}
                          onChange={(e) =>
                            cambiarHorarioDeDia(
                              diaIndex,
                              horarioIndex,
                              "horaInicio",
                              e.target.value,
                            )
                          }
                          className={inputClass}
                        />

                        <input
                          type="time"
                          value={horario.horaFin}
                          onChange={(e) =>
                            cambiarHorarioDeDia(
                              diaIndex,
                              horarioIndex,
                              "horaFin",
                              e.target.value,
                            )
                          }
                          className={inputClass}
                        />

                        {!esEdicion && dia.horarios.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              eliminarHorarioDeDia(diaIndex, horarioIndex)
                            }
                            className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:border-red-400"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    ))}

                    {erroresPorDia[diaIndex] && (
                      <p className="text-sm text-red-400">
                        ⚠ {erroresPorDia[diaIndex]} en{" "}
                        {nombreDia(dia.diaSemana)}
                      </p>
                    )}

                    {!esEdicion && (
                      <button
                        type="button"
                        onClick={() => agregarHorarioADia(diaIndex)}
                        className="text-[#4adea8] text-sm font-semibold hover:underline"
                      >
                        + Agregar horario para {nombreDia(dia.diaSemana)}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                {tipoClase === "puntual"
                  ? "Fecha de la clase"
                  : "Fecha de inicio"}
              </label>

              <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleFechaInicioChange}
                className={inputClass}
              />

              {!esEdicion && form.fechaInicio && (
                <p className="mt-2 text-xs text-gray-500">
                  Día detectado:{" "}
                  {nombreDia(obtenerDiaDesdeFecha(form.fechaInicio))}. La fecha
                  elegida no se modificará automáticamente.
                </p>
              )}
            </div>

            {tipoClase === "recurrente" && (
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Fecha de fin
                </label>

                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Cupo máximo
            </label>

            <input
              type="number"
              name="cupoMaximo"
              value={form.cupoMaximo}
              onChange={handleChange}
              placeholder="Ej: 18"
              min={esEdicion ? cantidadInscriptos : 1}
              className={inputClass}
            />
          </div>

          <div className="space-y-5 rounded-3xl border border-[#2d463b] bg-[#12201b] p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Equipo responsable
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Entrenadores de la clase
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Seleccioná uno o varios entrenadores y definí quién será el
                responsable principal.
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-200">
                Entrenador principal
              </label>

              <select
                value={form.entrenadorPrincipalId}
                onChange={(e) => {
                  const principal = Number(e.target.value);

                  setForm((prev) => ({
                    ...prev,
                    entrenadorPrincipalId: principal,
                    entrenadoresIds:
                      principal === 0
                        ? prev.entrenadoresIds
                        : [
                            principal,
                            ...prev.entrenadoresIds.filter(
                              (id) => id !== 0 && id !== principal,
                            ),
                          ],
                  }));
                }}
                className={inputClass}
              >
                <option value={0}>Seleccionar entrenador</option>

                {entrenadores.map((entrenador) => (
                  <option key={entrenador.id} value={entrenador.id}>
                    {entrenador.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                entrenadoresIds: [...prev.entrenadoresIds, 0],
              }))
            }
            className="px-4 py-2 rounded-xl border border-[#4adea8] text-[#4adea8] hover:bg-[#4adea8]/10"
          >
            + Agregar otro entrenador
          </button>

          <div className="space-y-3">
            {form.entrenadoresIds
              .filter((id) => id !== form.entrenadorPrincipalId)
              .map((idSeleccionado, index) => (
                <div key={index} className="flex gap-3">
                  <select
                    value={idSeleccionado}
                    className={`${inputClass} flex-1`}
                    onChange={(e) => {
                      const nuevoId = Number(e.target.value);

                      setForm((prev) => {
                        const ids = [...prev.entrenadoresIds];

                        const posicion = ids.findIndex(
                          (x) =>
                            x === idSeleccionado &&
                            x !== prev.entrenadorPrincipalId,
                        );

                        ids[posicion] = nuevoId;

                        return {
                          ...prev,
                          entrenadoresIds: [...new Set(ids)],
                        };
                      });
                    }}
                  >
                    <option value={0}>Seleccionar entrenador</option>

                    {entrenadores
                      .filter(
                        (e) =>
                          e.id === idSeleccionado ||
                          !form.entrenadoresIds.includes(e.id),
                      )
                      .map((entrenador) => (
                        <option key={entrenador.id} value={entrenador.id}>
                          {entrenador.nombreCompleto}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        entrenadoresIds: prev.entrenadoresIds.filter(
                          (x) => x !== idSeleccionado,
                        ),
                      }))
                    }
                    className="px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Ubicación de la clase
            </label>

            <ClassLocationMap
              latitud={form.latitud}
              longitud={form.longitud}
              radio={form.radioGeolocalizacion}
              editable
              direccion={direccionSeleccionada}
              onLocationChange={(latitud, longitud, direccion) => {
                setDireccionSeleccionada(direccion ?? "");

                setForm((prev) => ({
                  ...prev,
                  latitud,
                  longitud,
                  codigoPostal: "",
                }));
              }}
            />
          </div>

          <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-300">Radio permitido</label>

              <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] text-sm font-bold">
                {form.radioGeolocalizacion} metros
              </span>
            </div>

            <input
              type="range"
              min={25}
              max={300}
              step={25}
              value={form.radioGeolocalizacion}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  radioGeolocalizacion: Number(e.target.value),
                }))
              }
              className="w-full accent-[#4adea8]"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>25 m</span>
              <span>100 m</span>
              <span>300 m</span>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Los alumnos deberán estar dentro del círculo verde para registrar
              asistencia.
            </p>
          </div>

          {!esEdicion && (
            <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
              <h3 className="font-bold text-[#4adea8] mb-3">Vista previa</h3>

              <p className="text-sm text-gray-300 mb-2">
                Grupo: {obtenerNombreGrupo()}
              </p>

              <p className="text-sm text-gray-300 mb-3">
                Se crearán {cantidadClasesACrear} clase
                {cantidadClasesACrear === 1 ? "" : "s"}:
              </p>

              <div className="space-y-2">
                {tipoClase === "puntual" ? (
                  <p className="text-sm text-gray-400">
                    ✔ {form.fechaInicio || "Sin fecha"} —{" "}
                    {horarioPuntual.horaInicio || "--:--"} a{" "}
                    {horarioPuntual.horaFin || "--:--"}
                  </p>
                ) : (
                  diasConHorarios.map((dia) =>
                    dia.horarios.map((horario, index) => (
                      <p
                        key={`${dia.diaSemana}-${index}`}
                        className="text-sm text-gray-400"
                      >
                        ✔ {nombreDia(dia.diaSemana)} —{" "}
                        {horario.horaInicio || "--:--"} a{" "}
                        {horario.horaFin || "--:--"}
                      </p>
                    )),
                  )
                )}
              </div>
            </div>
          )}

          <button
            disabled={guardando || hayErroresEnHorarios}
            className="w-full py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : hayErroresEnHorarios
                ? "Corregí los horarios para continuar"
                : esEdicion
                  ? "Guardar cambios"
                  : cantidadClasesACrear > 1
                    ? `Crear ${cantidadClasesACrear} clases`
                    : "Crear clase"}
          </button>
        </form>
      </main>

      <ConflictoEntrenadoresModal
        abierto={conflictoPendiente !== null}
        mensaje={
          conflictoPendiente?.respuesta.mensaje ??
          "Uno o más entrenadores ya tienen otra clase en ese horario."
        }
        conflictos={conflictoPendiente?.respuesta.conflictos ?? []}
        confirmando={confirmandoConflicto}
        onCancelar={cancelarConflicto}
        onConfirmar={confirmarConflicto}
      />
    </div>
  );
}
