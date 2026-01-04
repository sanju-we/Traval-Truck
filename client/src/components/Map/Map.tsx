// Update your MapSection component props interface
interface StartingLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}
interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  dayPreference?: number;
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
  selected: boolean;
  placeId: string;
}

interface MapSectionProps {
  mapCenter: { lat: number; lng: number };
  places: Place[];
  startingLocation?: StartingLocation | null;
}

// Update your MapSection component
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

export default function MapSection({ mapCenter, places, startingLocation }: MapSectionProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '700px',
  };

  // Auto-fit bounds when markers change
  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    // Add starting location to bounds
    if (startingLocation) {
      bounds.extend({ lat: startingLocation.lat, lng: startingLocation.lng });
      hasLocations = true;
    }

    // Add all destination places to bounds
    places.forEach(place => {
      bounds.extend({ lat: place.lat, lng: place.lng });
      hasLocations = true;
    });

    // Fit map to show all markers
    if (hasLocations) {
      map.fitBounds(bounds);
      
      // Prevent over-zooming for single location
      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const zoom = map.getZoom();
        if (zoom && zoom > 15) {
          map.setZoom(15);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, places, startingLocation]);

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={setMap}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* BLUE PIN - Starting Location Marker */}
        {startingLocation && (
          <Marker
            position={{ lat: startingLocation.lat, lng: startingLocation.lng }}
            title={`Starting Point: ${startingLocation.name}`}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: '#3B82F6', // Blue color
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
            }}
            label={{
              text: '🏠',
              fontSize: '18px',
            }}
          />
        )}

        {/* GREEN/GRAY PINS - Destination Places Markers */}
        {places.map((place, index) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            title={place.name}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: place.selected ? '#10B981' : '#6B7280', // Green if selected, gray if not
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            }}
            label={{
              text: (index + 1).toString(),
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          />
        ))}
      </GoogleMap>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Map Legend</h4>
        <div className="space-y-1.5 text-xs">
          {startingLocation && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-sm">
                🏠
              </div>
              <span className="text-gray-700">Starting Point</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
              1
            </div>
            <span className="text-gray-700">Selected Places</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-500 border border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
              2
            </div>
            <span className="text-gray-700">Unselected Places</span>
          </div>
        </div>
      </div>

      {/* Info Bar - Shows what's on the map */}
      {(startingLocation || places.length > 0) && (
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-4">
              {startingLocation && (
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600">🏠</span>
                  <span className="font-medium text-gray-700">Start:</span>
                  <span className="text-gray-600 truncate max-w-[150px]">{startingLocation.name}</span>
                </div>
              )}
              {places.length > 0 && (
                <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                  <span className="font-medium text-gray-700">Places:</span>
                  <span className="text-gray-600">{places.length}</span>
                  <span className="text-emerald-600 font-medium">
                    ({places.filter(p => p.selected).length} selected)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}