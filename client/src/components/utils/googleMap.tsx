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

const defaultCenter = { lat: 11.2587531, lng: 75.78041 }; 

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
