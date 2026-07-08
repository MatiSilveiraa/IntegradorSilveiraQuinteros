import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import ResumenCard from "../components/ui/ResumenCard";

import {
  obtenerCuotasAdmin,
  obtenerResumenCuotasAdmin,
} from "../services/AdminCuota.Service";

import { registrarPagoManual } from "../services/Pago.service";

import type { CuotaAdmin, ResumenCuotasAdmin } from "../types";

const estados = [
  { valor: "", texto: "Todos" },
  { valor: "PENDIENTE", texto: "Pendientes" },
  { valor: "PAGADA", texto: "Pagadas" },
  { valor: "VENCIDA", texto: "Vencidas" },
  { valor: "BONIFICADA", texto: "Bonificadas" },
];

const meses = [
  { valor: 1, texto: "Enero" },
  { valor: 2, texto: "Febrero" },
  { valor: 3, texto: "Marzo" },
  { valor: 4, texto: "Abril" },
  { valor: 5, texto: "Mayo" },
  { valor: 6, texto: "Junio" },
  { valor: 7, texto: "Julio" },
  { valor: 8, texto: "Agosto" },
  { valor: 9, texto: "Septiembre" },
  { valor: 10, texto: "Octubre" },
  { valor: 11, texto: "Noviembre" },
  { valor: 12, texto: "Diciembre" },
];

export default function AdminCuotasPage() {
  const hoy = new Date();

  const [loading, setLoading] = useState(true);
  const [cuotas, setCuotas] = useState<CuotaAdmin[]>([]);

  const [resumen, setResumen] = useState<ResumenCuotasAdmin>({
    totalCuotas: 0,
    pendientes: 0,
    pagadas: 0,
    vencidas: 0,
    recaudado: 0,
    montoPendiente: 0,
  });

  const [estado, setEstado] = useState("");
  const [buscar, setBuscar] = useState("");
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());

  const [alumnoIdFiltro, setAlumnoIdFiltro] = useState<number | null>(null);
  const [alumnoNombreFiltro, setAlumnoNombreFiltro] = useState("");
  const [alumnoEmailFiltro, setAlumnoEmailFiltro] = useState("");

  const [cuotaPago, setCuotaPago] = useState<CuotaAdmin | null>(null);
  const [referenciaExterna, setReferenciaExterna] = useState("");
  const [medioPago, setMedioPago] = useState(0);
  const [guardandoPago, setGuardandoPago] = useState(false);
  const [selectorCuotaPago, setSelectorCuotaPago] = useState(false);
const [cuotasParaPago, setCuotasParaPago] = useState<CuotaAdmin[]>([]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const filtros = alumnoIdFiltro
        ? {
            alumnoId: alumnoIdFiltro,
            estado: estado || undefined,
          }
        : {
            estado: estado || undefined,
            buscar: buscar || undefined,
            mes,
            anio,
          };

      const [cuotasData, resumenData] = await Promise.all([
        obtenerCuotasAdmin(filtros),
        obtenerResumenCuotasAdmin({ mes, anio }),
      ]);

      setCuotas(cuotasData);
      setResumen(resumenData);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible cargar las cuotas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [estado, mes, anio, alumnoIdFiltro]);

  const cuotasOrdenadas = useMemo(() => {
    return [...cuotas].sort((a, b) => {
      if (a.anio !== b.anio) {
        return a.anio - b.anio;
      }

      return a.mes - b.mes;
    });
  }, [cuotas]);

  const cuotasFiltradas = useMemo(() => {
    if (alumnoIdFiltro) return cuotasOrdenadas;

    if (!buscar.trim()) return cuotasOrdenadas;

    const texto = buscar.toLowerCase();

    return cuotasOrdenadas.filter(
      (c) =>
        c.alumnoNombre.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto)
    );
  }, [cuotasOrdenadas, buscar, alumnoIdFiltro]);

  const resumenAlumno = useMemo(() => {
    return {
      total: cuotasFiltradas.length,
      pendientes: cuotasFiltradas.filter(
        (c) => c.estado !== "PAGADA" && !c.bonificada
      ).length,
      vencidas: cuotasFiltradas.filter(
        (c) => c.vencida && c.estado !== "PAGADA" && !c.bonificada
      ).length,
      pagadas: cuotasFiltradas.filter((c) => c.estado === "PAGADA").length,
    };
  }, [cuotasFiltradas]);

  const formatearDinero = (valor: number) => {
    return `$${valor.toLocaleString("es-UY")}`;
  };

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const nombreMes = (mesNumero: number) => {
    return meses.find((m) => m.valor === mesNumero)?.texto ?? String(mesNumero);
  };

  const colorEstado = (cuota: CuotaAdmin) => {
    if (cuota.bonificada) {
      return "bg-purple-500/10 text-purple-300 border-purple-500/30";
    }

    if (cuota.vencida && cuota.estado !== "PAGADA") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (cuota.estado === "PAGADA") {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
  };

  const textoEstado = (cuota: CuotaAdmin) => {
    if (cuota.bonificada) return "Bonificada";
    if (cuota.vencida && cuota.estado !== "PAGADA") return "Vencida";
    if (cuota.estado === "PAGADA") return "Pagada";
    return "Pendiente";
  };

const puedeRegistrarPago = (cuota: CuotaAdmin) => {
  return (
    cuota.estado !== "PAGADA" &&
    !cuota.bonificada &&
    cuota.montoFinal > 0
  );
};

const abrirPagoManual = async (cuota: CuotaAdmin) => {
  try {
    const cuotasAlumno = await obtenerCuotasAdmin({
      alumnoId: cuota.alumnoId,
    });

    const cuotasPendientes = cuotasAlumno.filter(puedeRegistrarPago);

    if (cuotasPendientes.length > 1) {
      setCuotasParaPago(cuotasPendientes);
      setSelectorCuotaPago(true);
      return;
    }

    setCuotaPago(cuota);
    setMedioPago(0);
    setReferenciaExterna("");
  } catch (error) {
    console.error(error);
    toast.error("No fue posible cargar las cuotas del alumno");
  }
};

  const verCuotasDelAlumno = (cuota: CuotaAdmin) => {
    setAlumnoIdFiltro(cuota.alumnoId);
    setAlumnoNombreFiltro(cuota.alumnoNombre);
    setAlumnoEmailFiltro(cuota.email);
    setBuscar("");
    setEstado("");
  };

  const guardarPagoManual = async () => {
    if (!cuotaPago) return;

    if (!referenciaExterna.trim()) {
      toast.error("Ingresá una referencia del pago");
      return;
    }

    try {
      setGuardandoPago(true);

      await registrarPagoManual({
        cuotaId: cuotaPago.cuotaId,
        medioPago,
        referenciaExterna,
      });

      toast.success("Pago manual registrado correctamente");

      setCuotaPago(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible registrar el pago"
      );
    } finally {
      setGuardandoPago(false);
    }
  };

  const limpiarFiltros = () => {
    setEstado("");
    setBuscar("");
    setMes(hoy.getMonth() + 1);
    setAnio(hoy.getFullYear());
    setAlumnoIdFiltro(null);
    setAlumnoNombreFiltro("");
    setAlumnoEmailFiltro("");
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Cuotas</h1>

          <p className="text-gray-400 mt-2">
            Consultá cuotas de alumnos y registrá pagos manuales.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <ResumenCard titulo="Total" valor={resumen.totalCuotas} />
          <ResumenCard titulo="Pendientes" valor={resumen.pendientes} />
          <ResumenCard titulo="Pagadas" valor={resumen.pagadas} />
          <ResumenCard titulo="Vencidas" valor={resumen.vencidas} />
          <ResumenCard
            titulo="Recaudado"
            valor={formatearDinero(resumen.recaudado)}
          />
        </div>

        {!alumnoIdFiltro && (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-5">Filtros</h2>

            <div className="grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Buscar alumno
                </label>

                <input
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") cargarDatos();
                  }}
                  placeholder="Nombre o email"
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Estado
                </label>

                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                >
                  {estados.map((item) => (
                    <option key={item.valor} value={item.valor}>
                      {item.texto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Mes</label>

                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                >
                  {meses.map((item) => (
                    <option key={item.valor} value={item.valor}>
                      {item.texto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Año</label>

                <input
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              <button
                onClick={limpiarFiltros}
                className="px-6 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        {alumnoIdFiltro && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-3xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-yellow-300">
                  Historial de cuotas de {alumnoNombreFiltro}
                </h2>

                {alumnoEmailFiltro && (
                  <p className="text-gray-300 mt-1">{alumnoEmailFiltro}</p>
                )}

                <p className="text-gray-300 text-sm mt-3">
                  Se muestran todas las cuotas registradas para este alumno.
                  Si sigue bloqueado, revisá cuotas vencidas anteriores.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <MiniResumen titulo="Total" valor={resumenAlumno.total} />
                <MiniResumen titulo="Pendientes" valor={resumenAlumno.pendientes} />
                <MiniResumen titulo="Vencidas" valor={resumenAlumno.vencidas} />
                <MiniResumen titulo="Pagadas" valor={resumenAlumno.pagadas} />
              </div>
            </div>

            <button
              onClick={limpiarFiltros}
              className="mt-5 px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
            >
              ← Volver al listado mensual
            </button>
          </div>
        )}

        {cuotasFiltradas.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay cuotas para mostrar
            </h2>

            <p className="text-gray-400">
              No se encontraron cuotas con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#12201b] text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Alumno</th>
                    <th className="p-4">Periodo</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Monto</th>
                    <th className="p-4">Vencimiento</th>
                    <th className="p-4">Pago</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cuotasFiltradas.map((cuota) => (
                    <tr
                      key={cuota.cuotaId}
                      className="border-t border-[#2d463b] hover:bg-[#12201b]/60"
                    >
                      <td className="p-4">
                        <p className="font-bold">{cuota.alumnoNombre}</p>
                        <p className="text-sm text-gray-400">{cuota.email}</p>

                        {cuota.bloqueadoPorDeuda &&
                          cuota.estado !== "PAGADA" &&
                          !cuota.bonificada && (
                            <p className="text-xs text-red-400 mt-1">
                              Bloqueado por deuda
                            </p>
                          )}
                      </td>

                      <td className="p-4 text-gray-300">
                        {nombreMes(cuota.mes)} {cuota.anio}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${colorEstado(
                            cuota
                          )}`}
                        >
                          {textoEstado(cuota)}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold">
                          {formatearDinero(cuota.montoFinal)}
                        </p>

                        {cuota.descuento > 0 && (
                          <p className="text-xs text-[#4adea8] mt-1">
                            Descuento: {formatearDinero(cuota.descuento)}
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-gray-300">
                        {formatearFecha(cuota.fechaVencimiento)}
                      </td>

                      <td className="p-4 text-gray-300">
                        {formatearFecha(cuota.fechaPago)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex flex-col gap-2 items-end">
                          {puedeRegistrarPago(cuota) ? (
                            <button
                              onClick={() => abrirPagoManual(cuota)}
                              className="px-4 py-2 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
                            >
                              Registrar pago manual
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Sin acciones
                            </span>
                          )}

                          {!alumnoIdFiltro && (
                            <button
                              onClick={() => verCuotasDelAlumno(cuota)}
                              className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
                            >
                              Ver historial
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

        {selectorCuotaPago && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
    <div className="w-full max-w-2xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
      <h2 className="text-2xl font-bold mb-2">
        Seleccionar cuota a pagar
      </h2>

      <p className="text-gray-400 mb-6">
        Este alumno tiene más de una cuota pendiente o vencida. Elegí cuál querés registrar.
      </p>

      <div className="space-y-3">
        {cuotasParaPago.map((cuota) => (
          <button
            key={cuota.cuotaId}
            type="button"
            onClick={() => {
              setSelectorCuotaPago(false);
              setCuotaPago(cuota);
              setMedioPago(0);
              setReferenciaExterna("");
            }}
            className="w-full text-left bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] rounded-2xl p-5"
          >
            <p className="font-bold">
              {nombreMes(cuota.mes)} {cuota.anio}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Estado: {textoEstado(cuota)}
            </p>

            <p className="text-2xl font-bold text-[#4adea8] mt-3">
              {formatearDinero(cuota.montoFinal)}
            </p>

            {cuota.vencida && cuota.estado !== "PAGADA" && (
              <p className="text-sm text-red-400 mt-2">
                Cuota vencida
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setSelectorCuotaPago(false)}
          className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


      {cuotaPago && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              Registrar pago manual
            </h2>

            <p className="text-gray-400 mb-6">
              Usá esta opción solo para pagos fuera de Mercado Pago.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="font-bold">{cuotaPago.alumnoNombre}</p>

              <p className="text-gray-400 mt-1">
                {nombreMes(cuotaPago.mes)} {cuotaPago.anio}
              </p>

              <p className="text-2xl font-bold text-[#4adea8] mt-3">
                {formatearDinero(cuotaPago.montoFinal)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Medio de pago
                </label>

                <select
                  value={medioPago}
                  onChange={(e) => setMedioPago(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                >
                  <option value={0}>Efectivo</option>
                  <option value={1}>Transferencia / Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Referencia
                </label>

                <textarea
                  rows={3}
                  value={referenciaExterna}
                  onChange={(e) => setReferenciaExterna(e.target.value)}
                  placeholder="Ej: Pago en efectivo, transferencia BROU, comprobante..."
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-7">
              <button
                disabled={guardandoPago}
                onClick={() => setCuotaPago(null)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                disabled={guardandoPago}
                onClick={guardarPagoManual}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-60"
              >
                {guardandoPago ? "Registrando..." : "Confirmar pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniResumen({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl px-4 py-3 min-w-[95px]">
      <p className="text-xs text-gray-400">{titulo}</p>
      <p className="text-xl font-bold text-[#4adea8] mt-1">{valor}</p>
    </div>
  );
}