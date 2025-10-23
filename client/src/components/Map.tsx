'use client';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { useState, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 11.2588, // Calicut
  lng: 75.7804,
};

export default function MapComponent({ onLocationSelect }: any) {
  const [position, setPosition] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || '';

      setPosition({ lat, lng });
      setMapCenter({ lat, lng });
      onLocationSelect({ lat, lng, address });
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onLocationSelect({ lat, lng, address: `Lat: ${lat}, Lng: ${lng}` });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={'AIzaSyCoodxlMhx3DVDTS0oqEruM_9tX9Rtg3Wk'}
      libraries={['places']}
    >
      <div className="mb-3">
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search location..."
            className="border rounded-md p-2 w-full"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClick}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
}
