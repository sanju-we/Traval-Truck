'use client';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 11.2588,
  lng: 75.7804,
};

interface MapComponentProps {
  onLocationSelect: (data: { lat: number; lng: number; address: string | null }) => void;
  initialPosition?: { lat: number; lng: number };
  initialAddress?: string; // ✅ Allow passing an address
}

export default function MapComponent({
  onLocationSelect,
  initialPosition,
  initialAddress,
}: MapComponentProps) {
  const [position, setPosition] = useState(initialPosition || defaultCenter);
  const [mapCenter, setMapCenter] = useState(initialPosition || defaultCenter);
  const [searchValue, setSearchValue] = useState(initialAddress || ''); // ✅ Local state for input
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ If initial position updates (like in Edit Modal), update map and search box
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      setMapCenter(initialPosition);
    }
  }, [initialPosition]);

  // ✅ If address changes externally, update search field
  useEffect(() => {
    if (initialAddress && inputRef.current) {
      setSearchValue(initialAddress);
    }
  }, [initialAddress]);

  // 🧭 When user searches via autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || null;

      setPosition({ lat, lng });
      setMapCenter({ lat, lng });
      setSearchValue(address || ''); // ✅ Update input with formatted address

      onLocationSelect({ lat, lng, address });
    }
  };

  // 📍 When user clicks directly on the map
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setPosition({ lat, lng });

      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });

      const address =
        response.results && response.results.length > 0
          ? response.results[0].formatted_address
          : `Lat: ${lat}, Lng: ${lng}`;

      setSearchValue(address); // ✅ Show address in search box

      onLocationSelect({ lat, lng, address });
    }
  };

  return (
    <LoadScript googleMapsApiKey='AIzaSyCoodxlMhx3DVDTS0oqEruM_9tX9Rtg3Wk' libraries={['places']}>
      <div className="mb-3">
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search location..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onClick={handleMapClick}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
}
