import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { actualizarMiPerfil } from "../services/Perfil.service";
import { obtenerMiPerfil } from "../services/Perfil.service";
import { useEffect } from "react";

export default function CompletarPerfilPage() {
  const navigate = useNavigate();

  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [celular, setCelular] = useState("");
  const [sociedadMedica, setSociedadMedica] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await actualizarMiPerfil({
  nombre: perfil.nombre,
  apellido: perfil.apellido,
  email: perfil.email,
  genero: perfil.genero,
  fechaNacimiento,
  celular,
  sociedadMedica,
});

      navigate("/alumno");
    } catch (error: any) {
      console.log(error.response?.data);

      alert(JSON.stringify(error.response?.data, null, 2));

      setError("No fue posible guardar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-white text-3xl font-bold mt-6">
            Completar Perfil
          </h1>

          <p className="text-gray-400 mt-2 text-center">
            Necesitamos algunos datos antes de continuar.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl mt-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={guardar} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Fecha de nacimiento
            </label>

            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Celular</label>

            <input
              type="text"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              placeholder="099123456"
              className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Sociedad médica
            </label>

            <input
              type="text"
              value={sociedadMedica}
              onChange={(e) => setSociedadMedica(e.target.value)}
              placeholder="ASSE, CASMU, Médica Uruguaya..."
              className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !perfil}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl"
          >
            {loading ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
