import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Import Leaflet styles

const position: LatLngExpression = [51.505, -0.09];  // Default location (latitude, longitude)

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      {/* TileLayer will load OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Marker for location */}
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
