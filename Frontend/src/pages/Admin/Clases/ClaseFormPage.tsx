import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../../components/FullScreenSpinner";
import ClassLocationMap from "../../../components/maps/ClassLocationMap";

import { obtenerGrupos } from "../../../services/Grupo.Service";
import {
  crearClase,
  editarClase,
  obtenerClasePorId,
} from "../../../services/Clase.Service";

import type { CrearClaseRequest, Grupo } from "../../../types";

type HorarioClase = {
  horaInicio: string;
  horaFin: string;
};

type DiaConHorarios = {
  diaSemana: number;
  horarios: HorarioClase[];
};

type TipoClase = "puntual" | "recurrente";

export default function ClaseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

const grupoIdDesdeUrl = searchParams.get("grupoId");

  const esEdicion = Boolean(id);

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [tipoClase, setTipoClase] = useState<TipoClase>("recurrente");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");

  const [horarioPuntual, setHorarioPuntual] = useState<HorarioClase>({
    horaInicio: "",
    horaFin: "",
  });

  const [diasConHorarios, setDiasConHorarios] = useState<DiaConHorarios[]>([
    {
      diaSemana: 1,
      horarios: [{ horaInicio: "", horaFin: "" }],
    },
  ]);

  const [form, setForm] = useState<CrearClaseRequest>({
    grupoId: grupoIdDesdeUrl ? Number(grupoIdDesdeUrl) : 0,
    diaSemana: 1,
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
  });

  const grupoSeleccionadoDesdeUrl =
  grupos.find((g) => g.id === Number(grupoIdDesdeUrl));

  const inputClass =
    "w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]";

  const diasSemana = [
    { valor: 1, nombre: "Lunes" },
    { valor: 2, nombre: "Martes" },
    { valor: 3, nombre: "Miércoles" },
    { valor: 4, nombre: "Jueves" },
    { valor: 5, nombre: "Viernes" },
    { valor: 6, nombre: "Sábado" },
    { valor: 0, nombre: "Domingo" },
  ];

  const nombreDia = (dia: number) =>
    diasSemana.find((d) => d.valor === dia)?.nombre ?? "";

  const convertirDiaANumero = (dia: string) => {
    const dias: Record<string, number> = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Sabado: 6,
    };

    return dias[dia] ?? 1;
  };

  const obtenerDiaDesdeFecha = (fecha: string) => {
    const date = new Date(`${fecha}T00:00:00`);
    return date.getDay();
  };

  const obtenerProximaFechaValida = (
    fecha: string,
    diasValidos: number[]
  ) => {
    const date = new Date(`${fecha}T00:00:00`);

    for (let i = 0; i <= 7; i++) {
      const candidata = new Date(date);
      candidata.setDate(date.getDate() + i);

      if (diasValidos.includes(candidata.getDay())) {
        return candidata.toISOString().substring(0, 10);
      }
    }

    return fecha;
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
    horarios.some((h) => h.horaInicio && h.horaFin && h.horaInicio >= h.horaFin);

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
    [horarioPuntual]
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

        if (esEdicion && id) {
          const clase = await obtenerClasePorId(Number(id));
          const diaNumero = convertirDiaANumero(clase.diaSemana);

          setTipoClase(clase.esFija ? "recurrente" : "puntual");

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
            grupoId: grupoIdDesdeUrl ? Number(grupoIdDesdeUrl) : 0,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleFechaInicioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fechaElegida = e.target.value;

    if (!fechaElegida) {
      setForm((prev) => ({
        ...prev,
        fechaInicio: "",
      }));
      return;
    }

    if (tipoClase === "recurrente") {
      const diasValidos = diasConHorarios.map((d) => d.diaSemana);
      const diaFecha = obtenerDiaDesdeFecha(fechaElegida);

      if (!diasValidos.includes(diaFecha)) {
        const fechaCorregida = obtenerProximaFechaValida(
          fechaElegida,
          diasValidos
        );

        toast(
          `La fecha elegida no coincide con los días configurados. Se ajustó al próximo ${nombreDia(
            obtenerDiaDesdeFecha(fechaCorregida)
          )}.`
        );

        setForm((prev) => ({
          ...prev,
          fechaInicio: fechaCorregida,
        }));

        return;
      }
    }

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
      (dia, i) => dia.diaSemana === diaSemana && i !== index
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
          : dia
      )
    );
  };

  const agregarHorarioADia = (diaIndex: number) => {
    setDiasConHorarios((prev) =>
      prev.map((dia, i) =>
        i === diaIndex
          ? {
              ...dia,
              horarios: [
                ...dia.horarios,
                { horaInicio: "", horaFin: "" },
              ],
            }
          : dia
      )
    );
  };

  const eliminarHorarioDeDia = (
    diaIndex: number,
    horarioIndex: number
  ) => {
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
      })
    );
  };

  const cambiarHorarioDeDia = (
    diaIndex: number,
    horarioIndex: number,
    campo: keyof HorarioClase,
    valor: string
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
                  : horario
              ),
            }
          : dia
      )
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
          : "Ingresá la fecha de inicio"
      );
      return false;
    }

    if (form.cupoMaximo <= 0) {
      toast.error("El cupo máximo debe ser mayor a 0");
      return false;
    }

    if (hayErroresEnHorarios) {
      toast.error("Corregí los errores de horarios antes de guardar");
      return false;
    }

    if (tipoClase === "recurrente") {
      const diasValidos = diasConHorarios.map((d) => d.diaSemana);

      if (!diasValidos.includes(obtenerDiaDesdeFecha(form.fechaInicio))) {
        toast.error(
          "La fecha de inicio debe coincidir con uno de los días configurados"
        );
        return false;
      }

      if (form.fechaFin && form.fechaFin < form.fechaInicio) {
        toast.error("La fecha de fin no puede ser anterior a la fecha de inicio");
        return false;
      }
    }

    return true;
  };

  const armarRequest = (
    diaSemana: number,
    horaInicio: string,
    horaFin: string
  ): CrearClaseRequest => ({
    ...form,
    diaSemana,
    esFija: tipoClase === "recurrente",
    horaInicio: formatearHora(horaInicio),
    horaFin: formatearHora(horaFin),
    fechaInicio: `${form.fechaInicio}T00:00:00`,
    fechaFin:
      tipoClase === "recurrente" && form.fechaFin
        ? `${form.fechaFin}T00:00:00`
        : null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setGuardando(true);

      if (esEdicion && id) {
        const dia =
          tipoClase === "puntual"
            ? obtenerDiaDesdeFecha(form.fechaInicio)
            : diasConHorarios[0].diaSemana;

        const horario =
          tipoClase === "puntual"
            ? horarioPuntual
            : diasConHorarios[0].horarios[0];

        await editarClase(
          Number(id),
          armarRequest(dia, horario.horaInicio, horario.horaFin)
        );

        toast.success("Clase actualizada correctamente");
      } else if (tipoClase === "puntual") {
        const dia = obtenerDiaDesdeFecha(form.fechaInicio);

        await crearClase(
          armarRequest(dia, horarioPuntual.horaInicio, horarioPuntual.horaFin)
        );

        toast.success("Clase puntual creada correctamente");
      } else {
        const requests = diasConHorarios.flatMap((dia) =>
          dia.horarios.map((horario) =>
            crearClase(
              armarRequest(
                dia.diaSemana,
                horario.horaInicio,
                horario.horaFin
              )
            )
          )
        );

        await Promise.all(requests);

        toast.success(
          requests.length === 1
            ? "Clase recurrente creada correctamente"
            : `${requests.length} clases recurrentes creadas correctamente`
        );
      }

      if (grupoIdDesdeUrl) {
  navigate(`/admin/grupos/${grupoIdDesdeUrl}`);
} else {
  navigate("/admin/clases");
}
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.mensaje ?? "No se pudo guardar la clase"
      );
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  const cantidadClasesACrear =
    tipoClase === "puntual"
      ? 1
      : diasConHorarios.reduce(
          (total, dia) => total + dia.horarios.length,
          0
        );

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/clases")}
            className="text-[#4adea8] hover:underline mb-4"
          >
            ← Volver a clases
          </button>

          <h1 className="text-3xl font-bold">
  {esEdicion
    ? "Editar clase"
    : grupoIdDesdeUrl && grupoSeleccionadoDesdeUrl
    ? `Nueva clase para ${grupoSeleccionadoDesdeUrl.nombre}`
    : "Nueva clase"}
</h1>

          <p className="text-gray-400 mt-2">
  {grupoIdDesdeUrl
    ? "La clase quedará asociada automáticamente al grupo seleccionado."
    : "Configurá la información general de la clase."}
</p>
        </div>

<form
  onSubmit={handleSubmit}
  className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 space-y-6"
>
  {grupoIdDesdeUrl && grupoSeleccionadoDesdeUrl && (
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
        onClick={() => cambiarTipoClase("puntual")}
        className={`rounded-2xl border p-5 text-left transition-all ${
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
        onClick={() => cambiarTipoClase("recurrente")}
        className={`rounded-2xl border p-5 text-left transition-all ${
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
    <label className="block mb-2 text-sm text-gray-300">
      Grupo
    </label>

  {grupoIdDesdeUrl ? (
  <div className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-gray-400">
    Grupo definido desde la pantalla anterior.
  </div>
) : (
    <select
      name="grupoId"
      value={form.grupoId}
      onChange={handleChange}
      className={inputClass}
    >
      <option value={0}>
        Seleccionar grupo
      </option>

      {grupos.map((grupo) => (
        <option
          key={grupo.id}
          value={grupo.id}
        >
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
                              e.target.value
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
                              e.target.value
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
                        ⚠ {erroresPorDia[diaIndex]} en {nombreDia(dia.diaSemana)}
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
              className={inputClass}
            />
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
              Los alumnos deberán estar dentro del círculo verde para registrar asistencia.
            </p>
          </div>

          {!esEdicion && (
            <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
              <h3 className="font-bold text-[#4adea8] mb-3">
                Vista previa
              </h3>

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
                    ))
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
    </div>
  );
}