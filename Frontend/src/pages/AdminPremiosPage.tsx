import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";

import {
  obtenerPremiosPendientes,
  marcarPremioEntregado,
} from "../services/AdminBeneficio.Service";

import type { Recompensa } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";
import TopBar from "../components/navigation/DashboardTopBar";

export default function AdminPremiosPage() {
  const navigate = useNavigate();

  const [premios, setPremios] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState(true);
  const [premioAEntregar, setPremioAEntregar] =
    useState<Recompensa | null>(null);
  const [entregando, setEntregando] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerPremiosPendientes();

      setPremios(data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los premios pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const confirmarEntrega = async () => {
    if (!premioAEntregar?.beneficioId) {
      toast.error("No fue posible identificar el beneficio");
      return;
    }

    try {
      setEntregando(true);

      await marcarPremioEntregado(
        premioAEntregar.beneficioId
      );

      toast.success("Premio entregado correctamente");

      setPremioAEntregar(null);

      await cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible marcar el premio como entregado"
      );
    } finally {
      setEntregando(false);
    }
  };

  const premiosOrdenados = useMemo(() => {
    return [...premios].sort((a, b) => {
      const nombreA = `${a.nombre ?? ""} ${a.apellido ?? ""}`.trim();
      const nombreB = `${b.nombre ?? ""} ${b.apellido ?? ""}`.trim();

      return nombreA.localeCompare(nombreB, "es");
    });
  }, [premios]);

  const obtenerIniciales = (premio: Recompensa) => {
    const primera =
      premio.nombre?.trim().charAt(0) ?? "";
    const segunda =
      premio.apellido?.trim().charAt(0) ?? "";

    const iniciales = `${primera}${segunda}`.toUpperCase();

    return iniciales || "A";
  };

  const obtenerNombreAlumno = (premio: Recompensa) => {
    const nombre = `${premio.nombre ?? ""} ${
      premio.apellido ?? ""
    }`.trim();

    return nombre || "Alumno sin nombre";
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-gray-400 hover:text-[#4adea8] transition-colors"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Panel de administración
        </button>

        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
                  <Inventory2OutlinedIcon className="text-[#4adea8]" />
                </div>

                <div>
                  <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                    Administración
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold mt-1">
                    Premios pendientes
                  </h1>
                </div>
              </div>

              <p className="text-gray-300 mt-5 max-w-2xl">
                Gestioná la entrega de premios físicos obtenidos por los alumnos.
              </p>
            </div>

            <div className="w-full lg:w-auto min-w-48 rounded-2xl bg-[#12201b] border border-[#2d463b] p-5">
              <p className="text-sm text-gray-400">
                Pendientes de entrega
              </p>

              <p className="text-4xl font-bold text-[#4adea8] mt-2">
                {premios.length}
              </p>
            </div>
          </div>
        </section>

        {premiosOrdenados.length === 0 ? (
          <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 md:p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
              <CheckCircleOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: "#4adea8",
                }}
              />
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Todo está al día
            </h2>

            <p className="mt-2 text-gray-400 max-w-xl mx-auto">
              No hay premios físicos pendientes de entrega en este momento.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {premiosOrdenados.map((premio) => (
              <article
                key={premio.beneficioId ?? premio.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
                      <EmojiEventsOutlinedIcon
                        sx={{
                          color: "#4adea8",
                          fontSize: 30,
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                        Pendiente
                      </span>

                      <h2 className="text-2xl font-bold mt-3 break-words">
                        {premio.descripcion ||
                          "Premio físico"}
                      </h2>

                      <p className="text-sm text-gray-400 mt-2">
                        Este premio todavía no fue entregado al alumno.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center">
                        {obtenerIniciales(premio)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Alumno
                        </p>

                        <h3 className="text-lg font-bold mt-1 truncate">
                          {obtenerNombreAlumno(premio)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPremioAEntregar(premio)}
                    className="w-full py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <RedeemOutlinedIcon fontSize="small" />
                    Confirmar entrega
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {premioAEntregar && (
        <div className="fixed inset-0 z-[9999] bg-black/70 px-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center mb-5">
              <RedeemOutlinedIcon
                sx={{
                  color: "#4adea8",
                  fontSize: 30,
                }}
              />
            </div>

            <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
              Confirmar entrega
            </p>

            <h2 className="text-2xl font-bold mt-2">
              ¿El premio fue entregado?
            </h2>

            <p className="text-gray-400 mt-3">
              Esta acción marcará el beneficio como entregado y dejará de aparecer entre los pendientes.
            </p>

            <div className="mt-6 space-y-3">
              <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Inventory2OutlinedIcon
                    className="text-[#4adea8] mt-0.5"
                    fontSize="small"
                  />

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Premio
                    </p>

                    <p className="font-bold mt-1">
                      {premioAEntregar.descripcion ||
                        "Premio físico"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <PersonOutlineOutlinedIcon
                    className="text-[#4adea8] mt-0.5"
                    fontSize="small"
                  />

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Alumno
                    </p>

                    <p className="font-bold mt-1">
                      {obtenerNombreAlumno(
                        premioAEntregar
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={() => setPremioAEntregar(null)}
                disabled={entregando}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-gray-200 font-semibold hover:border-[#4adea8] disabled:opacity-50 transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarEntrega}
                disabled={entregando}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {entregando
                  ? "Confirmando..."
                  : "Sí, marcar entregado"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}