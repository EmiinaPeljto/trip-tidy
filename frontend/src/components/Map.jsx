import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker icons using ES module syntax
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const Map = ({ center, markers }) => {
  if (!center || !center[0] || !center[1]) {
    // Return a fallback or null if center is not valid
    return <div className="flex items-center justify-center h-full bg-gray-200">Map data is unavailable.</div>;
  }

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers && markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position}>
          <Popup>{marker.popupContent}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;