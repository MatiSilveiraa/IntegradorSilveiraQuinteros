import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";

import {
  obtenerAuditorias,
  obtenerAuditoriasPorEntidad,
} from "../services/Auditoria.Service";

import type { Auditoria } from "../types";

const entidades = [
  { valor: "", texto: "Todos los módulos" },
  { valor: "Grupo", texto: "Grupos" },
  { valor: "Clase", texto: "Clases" },
  { valor: "Desafio", texto: "Desafíos" },
  { valor: "Recompensa", texto: "Recompensas" },
  { valor: "Descuento", texto: "Descuentos" },
  { valor: "Beneficio", texto: "Beneficios" },
  { valor: "Pago", texto: "Pagos" },
  { valor: "Cuota", texto: "Cuotas" },
  { valor: "Alumno", texto: "Alumnos" },
];

export default function AdminAuditoriaPage() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [cantidad, setCantidad] = useState(50);
  const [entidad, setEntidad] = useState("");

  const cargarAuditorias = async (
    entidadFiltro = entidad,
    cantidadFiltro = cantidad
  ) => {
    try {
      setLoading(true);

      const data = entidadFiltro
        ? await obtenerAuditoriasPorEntidad(entidadFiltro)
        : await obtenerAuditorias(cantidadFiltro);

      setAuditorias(data);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible cargar la auditoría"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  const cambiarEntidad = (valor: string) => {
    setEntidad(valor);
    cargarAuditorias(valor, cantidad);
  };

  const cambiarCantidad = (valor: number) => {
    setCantidad(valor);

    if (!entidad) {
      cargarAuditorias("", valor);
    }
  };

  const limpiarFiltros = () => {
    setEntidad("");
    setCantidad(50);
    cargarAuditorias("", 50);
  };

  const auditoriasOrdenadas = useMemo(() => {
    return [...auditorias].sort(
      (a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [auditorias]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obtenerNombreModulo = (entidad: string) => {
    const encontrada = entidades.find(
      (e) => e.valor.toLowerCase() === entidad.toLowerCase()
    );

    return encontrada?.texto ?? entidad;
  };

  const obtenerColorEntidad = (entidad: string) => {
    const valor = entidad.toLowerCase();

    if (valor.includes("clase")) {
      return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    }

    if (valor.includes("grupo")) {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    if (valor.includes("desafio")) {
      return "bg-purple-500/10 text-purple-300 border-purple-500/30";
    }

    if (valor.includes("descuento") || valor.includes("beneficio")) {
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    }

    if (valor.includes("pago") || valor.includes("cuota")) {
      return "bg-sky-500/10 text-sky-300 border-sky-500/30";
    }

    return "bg-gray-500/10 text-gray-300 border-gray-500/30";
  };

const limpiarTextoTecnico = (texto: string) => {
  return texto
    .replaceAll("ALUMNOS_SELECCIONADOS", "alumnos seleccionados")
    .replaceAll("DESCUENTO_CUOTA", "descuento sobre cuota")
    .replaceAll("CUOTA_GRATIS", "cuota gratis")
    .replaceAll("PRODUCTO_REGALO", "premio físico")
    .replaceAll("Medio: 0", "Medio: Efectivo")
    .replaceAll("Medio: 1", "Medio: Mercado Pago")
    .replaceAll("Medio: 2", "Medio: Transferencia")
    .replaceAll("Medio: 3", "Medio: Otro")
    .replaceAll(/Id \d+/gi, "")
    .replaceAll(/grupo \d+/gi, "grupo")
    .replaceAll("True", "Sí")
    .replaceAll("False", "No")
    .replaceAll("  ", " ")
    .trim();
};

  const resumirAccion = (auditoria: Auditoria) => {
  const accion = auditoria.accion.toLowerCase();
  const entidad = auditoria.entidad.toLowerCase();

  if (accion.includes("creó") || accion.includes("creo")) {
    if (entidad.includes("clase")) return "Clase creada";
    if (entidad.includes("grupo")) return "Grupo creado";
    if (entidad.includes("desafio")) return "Desafío creado";

    if (entidad.includes("descuento")) {
      const porcentaje = auditoria.accion.match(/Porcentaje:\s?([\d.]+)/i);

      return porcentaje
        ? `Descuento creado (${porcentaje[1]}%)`
        : "Descuento creado";
    }

    if (entidad.includes("beneficio")) {
      return "Beneficio creado";
    }

    if (entidad.includes("pago")) {
      return "Pago registrado";
    }

    return "Registro creado";
  }

  if (
    accion.includes("actualizó") ||
    accion.includes("actualizo") ||
    accion.includes("editó") ||
    accion.includes("edito")
  ) {
    if (entidad.includes("clase")) return "Clase actualizada";
    if (entidad.includes("grupo")) return "Grupo actualizado";
    if (entidad.includes("descuento")) return "Descuento actualizado";
    if (entidad.includes("desafio")) return "Desafío actualizado";

    return "Registro actualizado";
  }

  if (
    accion.includes("eliminó") ||
    accion.includes("elimino") ||
    accion.includes("desactivó") ||
    accion.includes("desactivo")
  ) {
    if (entidad.includes("grupo")) return "Grupo desactivado";
    if (entidad.includes("clase")) return "Clase eliminada";
    if (entidad.includes("descuento")) return "Descuento desactivado";

    return "Registro eliminado";
  }

  if (accion.includes("estado") && entidad.includes("clase")) {
    return "Estado de la clase actualizado";
  }

  if (accion.includes("entreg")) {
    return "Beneficio entregado";
  }

  if (accion.includes("pago")) {
    return "Pago registrado";
  }

  return (
    limpiarTextoTecnico(auditoria.accion) ||
    "Acción administrativa registrada"
  );
};

  const obtenerDetalleAccion = (auditoria: Auditoria) => {
    return limpiarTextoTecnico(auditoria.accion);
  };

  const obtenerDescripcionHumana = (auditoria: Auditoria) => {
  const entidad = auditoria.entidad.toLowerCase();

  if (entidad.includes("clase") && auditoria.entidadNombre) {
    return "Se registró una acción sobre esta clase.";
  }

  if (entidad.includes("pago") && auditoria.entidadNombre) {
    return "Se registró un pago manual asociado a esta cuota.";
  }

  if (entidad.includes("descuento")) {
    return "Se registró una acción relacionada con descuentos.";
  }

  if (entidad.includes("grupo")) {
    return "Se registró una acción sobre un grupo.";
  }

  return obtenerDetalleAccion(auditoria);
};

  const resumen = useMemo(() => {
    return {
      total: auditoriasOrdenadas.length,
      clases: auditoriasOrdenadas.filter((a) =>
        a.entidad.toLowerCase().includes("clase")
      ).length,
      grupos: auditoriasOrdenadas.filter((a) =>
        a.entidad.toLowerCase().includes("grupo")
      ).length,
      desafios: auditoriasOrdenadas.filter((a) =>
        a.entidad.toLowerCase().includes("desafio")
      ).length,
    };
  }, [auditoriasOrdenadas]);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Auditoría</h1>

          <p className="text-gray-400 mt-2">
            Historial de acciones administrativas realizadas en el sistema.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Resumen titulo="Registros" valor={resumen.total} />
          <Resumen titulo="Clases" valor={resumen.clases} />
          <Resumen titulo="Grupos" valor={resumen.grupos} />
          <Resumen titulo="Desafíos" valor={resumen.desafios} />
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">Filtros</h2>

          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Módulo
              </label>

              <select
                value={entidad}
                onChange={(e) => cambiarEntidad(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
              >
                {entidades.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.texto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Cantidad
              </label>

              <select
                value={cantidad}
                onChange={(e) => cambiarCantidad(Number(e.target.value))}
                disabled={!!entidad}
                className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8] disabled:opacity-60"
              >
                <option value={25}>Últimos 25</option>
                <option value={50}>Últimos 50</option>
                <option value={100}>Últimos 100</option>
              </select>
            </div>

            <button
              onClick={limpiarFiltros}
              className="px-8 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
            >
              Limpiar
            </button>
          </div>
        </div>

        {auditoriasOrdenadas.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay registros de auditoría
            </h2>

            <p className="text-gray-400">
              No se encontraron acciones para los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditoriasOrdenadas.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/30 transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${obtenerColorEntidad(
                          item.entidad
                        )}`}
                      >
                        {obtenerNombreModulo(item.entidad)}
                      </span>

                      <span className="text-sm text-gray-400">
                        {formatearFecha(item.fecha)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold">
                      {resumirAccion(item)}
                    </h3>

                    <p className="text-gray-400 mt-2">
  {obtenerDescripcionHumana(item)}
</p>

                    <div className="mt-4 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                      <p className="text-sm text-gray-400">Sobre</p>

                      <p className="font-bold mt-1">
  {item.entidadNombre ?? "Registro relacionado"}
</p>
                    </div>
                  </div>

                  <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 min-w-[220px]">
                    <p className="text-sm text-gray-400">Responsable</p>

                    <p className="font-bold mt-1">
                      {item.usuarioNombre ?? `Usuario #${item.usuarioId}`}
                    </p>

                    {item.usuarioEmail && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.usuarioEmail}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 mt-4">
                      Registro #{item.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Resumen({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>

      <p className="text-3xl font-bold text-[#4adea8] mt-2">{valor}</p>
    </div>
  );
}