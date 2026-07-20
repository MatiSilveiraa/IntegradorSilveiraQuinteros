type PaginationProps = {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarRegistrosPorPagina: (cantidad: number) => void;
  opcionesRegistros?: number[];
};

export default function Pagination({
  paginaActual,
  totalPaginas,
  totalRegistros,
  registrosPorPagina,
  onCambiarPagina,
  onCambiarRegistrosPorPagina,
  opcionesRegistros = [10, 20, 50],
}: PaginationProps) {
  const inicio =
    totalRegistros === 0
      ? 0
      : (paginaActual - 1) * registrosPorPagina + 1;

  const fin = Math.min(
    paginaActual * registrosPorPagina,
    totalRegistros,
  );

  const paginas = obtenerPaginasVisibles(
    paginaActual,
    totalPaginas,
  );

  const cambiarPagina = (pagina: number) => {
    if (
      pagina < 1 ||
      pagina > totalPaginas ||
      pagina === paginaActual
    ) {
      return;
    }

    onCambiarPagina(pagina);
  };

  return (
    <div className="border-t border-[#2d463b] bg-[#12201b]/50 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-400">
            Mostrando{" "}
            <span className="font-semibold text-white">
              {inicio}-{fin}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-white">
              {totalRegistros}
            </span>{" "}
            registros
          </p>

          <label className="flex items-center gap-2 text-sm text-gray-400">
            Mostrar
            <select
              value={registrosPorPagina}
              onChange={(event) =>
                onCambiarRegistrosPorPagina(
                  Number(event.target.value),
                )
              }
              className="rounded-xl border border-[#2d463b] bg-[#12201b] px-3 py-2 text-white outline-none focus:border-[#4adea8]"
            >
              {opcionesRegistros.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-2 xl:justify-end"
          aria-label="Paginación"
        >
          <button
            type="button"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-4 py-2 text-sm font-semibold hover:border-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anterior
          </button>

          {paginas.map((pagina, index) =>
            pagina === "..." ? (
              <span
                key={`separador-${index}`}
                className="px-2 text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={pagina}
                type="button"
                onClick={() => cambiarPagina(pagina)}
                aria-current={
                  pagina === paginaActual ? "page" : undefined
                }
                className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-bold ${
                  pagina === paginaActual
                    ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
                    : "border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8]"
                }`}
              >
                {pagina}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-4 py-2 text-sm font-semibold hover:border-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente →
          </button>
        </nav>
      </div>
    </div>
  );
}

function obtenerPaginasVisibles(
  paginaActual: number,
  totalPaginas: number,
): Array<number | "..."> {
  if (totalPaginas <= 7) {
    return Array.from(
      { length: totalPaginas },
      (_, index) => index + 1,
    );
  }

  if (paginaActual <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPaginas];
  }

  if (paginaActual >= totalPaginas - 3) {
    return [
      1,
      "...",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "...",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "...",
    totalPaginas,
  ];
}
