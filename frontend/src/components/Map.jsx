import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ center = { latitude: 40.7128, longitude: -74.0060 } }) => (
  <div className="w-full h-full" style={{ minHeight: 300 }}>
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={13}
      style={{ width: "100%", height: "100%", minHeight: 300, borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  </div>
);

export default Map;