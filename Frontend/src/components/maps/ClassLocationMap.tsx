import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
} from "react-leaflet";

type Props = {
  latitud: number;
  longitud: number;
  radio: number;
};

export default function ClassLocationMap({
  latitud,
  longitud,
  radio,
}: Props) {
  return (
    <MapContainer
      center={[latitud, longitud]}
      zoom={17}
      style={{
        height: "250px",
        width: "100%",
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitud, longitud]} />

      <Circle
        center={[latitud, longitud]}
        radius={radio}
      />
    </MapContainer>
  );
}