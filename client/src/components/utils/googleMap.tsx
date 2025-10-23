import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Define props if needed for reusability
type MapComponentProps = {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Example: San Francisco

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  center = defaultCenter,
  zoom = 12,
}) => (
  <LoadScript googleMapsApiKey={apiKey}>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
    >
      <Marker position={center} />
    </GoogleMap>
  </LoadScript>
);

export default MapComponent;
