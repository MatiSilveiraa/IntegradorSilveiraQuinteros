import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  latitud: number;
  longitud: number;
  radio: number;
  editable?: boolean;
  direccion?: string;
  onLocationChange?: (
    latitud: number,
    longitud: number,
    direccion?: string
  ) => void;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapAutoCenter({
  latitud,
  longitud,
}: {
  latitud: number;
  longitud: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitud, longitud], 17, {
      animate: true,
      duration: 0.6,
    });
  }, [latitud, longitud, map]);

  return null;
}

function MapClickHandler({
  editable,
  onSelect,
}: {
  editable: boolean;
  onSelect: (latitud: number, longitud: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!editable) return;

      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function ClassLocationMap({
  latitud,
  longitud,
  radio,
  editable = false,
  direccion,
  onLocationChange,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(
    direccion ?? ""
  );

  useEffect(() => {
    setDireccionSeleccionada(direccion ?? "");
  }, [direccion]);

  const buscarDireccion = async () => {
    if (!busqueda.trim()) return;

    try {
      setBuscando(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          busqueda
        )}`
      );

      const data = await response.json();

      setResultados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setBuscando(false);
    }
  };

  const obtenerDireccionPorCoordenadas = async (
    lat: number,
    lng: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      return data.display_name ?? "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const seleccionarUbicacion = async (lat: number, lng: number) => {
    const direccionObtenida = await obtenerDireccionPorCoordenadas(lat, lng);

    setDireccionSeleccionada(direccionObtenida);
    setResultados([]);

    onLocationChange?.(lat, lng, direccionObtenida);
  };

  const seleccionarResultado = (resultado: SearchResult) => {
    const lat = Number(resultado.lat);
    const lng = Number(resultado.lon);

    setDireccionSeleccionada(resultado.display_name);
    setResultados([]);
    setBusqueda("");

    onLocationChange?.(lat, lng, resultado.display_name);
  };

  return (
    <div className="space-y-4">
      {editable && (
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Buscar dirección
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarDireccion();
                }
              }}
              placeholder="Ej: Plaza Constitución, Melo"
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <button
              type="button"
              onClick={buscarDireccion}
              disabled={buscando}
              className="px-5 rounded-xl bg-[#4adea8] text-[#12201b] font-bold disabled:opacity-60"
            >
              {buscando ? "..." : "Buscar"}
            </button>
          </div>

          {resultados.length > 0 && (
            <div className="mt-3 bg-[#12201b] border border-[#2d463b] rounded-2xl overflow-hidden">
              {resultados.map((resultado) => (
                <button
                  key={`${resultado.lat}-${resultado.lon}`}
                  type="button"
                  onClick={() => seleccionarResultado(resultado)}
                  className="w-full text-left p-3 text-sm text-gray-300 hover:bg-[#4adea8]/10 border-b border-[#2d463b] last:border-b-0"
                >
                  {resultado.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-3xl overflow-hidden border border-[#2d463b]">
        <MapContainer
          center={[latitud, longitud]}
          zoom={17}
          style={{
            height: editable ? "350px" : "250px",
            width: "100%",
          }}
          scrollWheelZoom={editable}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapAutoCenter latitud={latitud} longitud={longitud} />

          <MapClickHandler
            editable={editable}
            onSelect={seleccionarUbicacion}
          />

          <Marker
            position={[latitud, longitud]}
            icon={markerIcon}
            draggable={editable}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();

                seleccionarUbicacion(position.lat, position.lng);
              },
            }}
          />

          <Circle
            center={[latitud, longitud]}
            radius={radio}
            pathOptions={{
              color: "#4adea8",
              fillColor: "#4adea8",
              fillOpacity: 0.15,
            }}
          />
        </MapContainer>
      </div>

      {editable && (
        <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
          <p className="text-sm text-gray-300 font-semibold mb-1">
            Dirección seleccionada
          </p>

          <p className="text-sm text-gray-400">
            {direccionSeleccionada || "Seleccioná una ubicación en el mapa."}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Coordenadas: {latitud.toFixed(6)}, {longitud.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}