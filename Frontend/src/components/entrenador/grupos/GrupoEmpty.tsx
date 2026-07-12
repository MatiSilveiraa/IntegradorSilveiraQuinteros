import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

type Props = {
  tipo?: "sin-grupos" | "sin-resultados";
  onLimpiar?: () => void;
};

export default function GrupoEmpty({
  tipo = "sin-grupos",
  onLimpiar,
}: Props) {
  const sinResultados =
    tipo === "sin-resultados";

  return (
    <section className="rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-10 md:p-14 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
        {sinResultados ? (
          <SearchOffOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 34,
            }}
          />
        ) : (
          <GroupsOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 34,
            }}
          />
        )}
      </div>

      <h2 className="text-2xl font-bold mt-5">
        {sinResultados
          ? "No encontramos grupos"
          : "No tenés grupos asignados"}
      </h2>

      <p className="mt-3 text-gray-400 max-w-xl mx-auto">
        {sinResultados
          ? "Probá cambiar la búsqueda o el filtro seleccionado."
          : "Cuando un administrador te asigne un grupo, aparecerá en esta sección."}
      </p>

      {sinResultados && onLimpiar && (
        <button
          type="button"
          onClick={onLimpiar}
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:brightness-110 transition-all"
        >
          <RestartAltOutlinedIcon fontSize="small" />
          Limpiar filtros
        </button>
      )}
    </section>
  );
}
