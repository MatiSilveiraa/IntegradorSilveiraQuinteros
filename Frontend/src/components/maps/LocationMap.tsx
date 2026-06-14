import { MapContainer, TileLayer, Marker } from "react-leaflet";

type Props = {
  latitud: number;
  longitud: number;
  zoom?: number;
};

export default function LocationMap({
  latitud,
  longitud,
  zoom = 17,
}: Props) {
  return (
    <MapContainer
      center={[latitud, longitud]}
      zoom={zoom}
      style={{
        height: "250px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitud, longitud]} />
    </MapContainer>
  );
}