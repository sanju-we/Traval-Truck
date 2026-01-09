'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Maximize2, Navigation, MapPin, Loader2 } from 'lucide-react';

interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface StartingPosition {
  address: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  title: string;
  status: 'Draft' | 'Ongoing' | 'Completed' | 'Confirm';
  startingPosition: StartingPosition;
  places: Place[];
  apiKey: string;
}

export default function RouteMap({
  title,
  status,
  startingPosition,
  places,
  apiKey,
}: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState('');
  const [routeDetails, setRouteDetails] = useState<any>(null);

  const canDownload = status === 'Ongoing' || status === 'Completed' || status === 'Confirm';

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (map) {
      calculateAndDisplayRoute();
    }
  }, [map, startingPosition, places]);

  const loadGoogleMapsScript = () => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else if (window.google) {
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: startingPosition.lat, lng: startingPosition.lng },
      zoom: 7,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#8b5cf6',
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });

    setMap(mapInstance);
    setDirectionsRenderer(renderer);
  };

  const calculateAndDisplayRoute = async () => {
    if (!map || !directionsRenderer) return;

    setIsLoading(true);

    try {
      const directionsService = new google.maps.DirectionsService();

      // Create waypoints from places
      const waypoints = places.map((place) => ({
        location: { lat: place.lat, lng: place.lng },
        stopover: true,
      }));

      // Request route from start -> waypoints -> back to start
      const request: google.maps.DirectionsRequest = {
        origin: { lat: startingPosition.lat, lng: startingPosition.lng },
        destination: { lat: startingPosition.lat, lng: startingPosition.lng },
        waypoints: waypoints,
        optimizeWaypoints: true, // Google will optimize the order
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          // Calculate total distance and duration
          let distance = 0;
          let duration = 0;

          const route = result.routes[0];
          route.legs.forEach((leg) => {
            distance += leg.distance?.value || 0;
            duration += leg.duration?.value || 0;
          });

          setTotalDistance(distance / 1000); // Convert to km
          setTotalDuration(duration / 60); // Convert to minutes
          setRouteDetails(result);

          // Add custom markers
          addCustomMarkers(route);
        } else {
          console.error('Directions request failed:', status);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      setIsLoading(false);
    }
  };

  const addCustomMarkers = (route: google.maps.DirectionsRoute) => {
    if (!map) return;

    // Starting point marker
    new google.maps.Marker({
      position: { lat: startingPosition.lat, lng: startingPosition.lng },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      label: {
        text: 'S',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      title: 'Starting Point: ' + startingPosition.address,
      zIndex: 1000,
    });

    // Waypoint markers
    places.forEach((place, index) => {
      new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        title: place.name,
        zIndex: 999,
      });
    });
  };

  const centerMap = () => {
    if (map) {
      map.setCenter({ lat: startingPosition.lat, lng: startingPosition.lng });
      map.setZoom(7);
    }
  };

  const fitRoute = () => {
    if (map && routeDetails) {
      const bounds = new google.maps.LatLngBounds();

      bounds.extend({ lat: startingPosition.lat, lng: startingPosition.lng });
      places.forEach((place) => {
        bounds.extend({ lat: place.lat, lng: place.lng });
      });

      map.fitBounds(bounds);
    }
  };

  async function buildDirectionsRoute(): Promise<string> {
  const directionsService = new google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: {
          lat: startingPosition.lat,
          lng: startingPosition.lng,
        },
        destination: {
          lat: places[places.length - 1].lat,
          lng: places[places.length - 1].lng,
        },
        waypoints: places.slice(0, -1).map(p => ({
          location: { lat: p.lat, lng: p.lng },
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status !== 'OK' || !result) {
          reject('Directions failed');
          return;
        }

        const route = result.routes[0];

        // ✅ SAFELY extract polyline
        const polyline = (result.routes[0].overview_polyline as unknown as { points: string }).points;


        if (!polyline) {
          reject('No polyline found');
          return;
        }

        resolve(polyline);
      }
    );
  });
}

  function buildStaticMapWithRoute(encodedPolyline: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const markers = places
    .map(
      (p, i) =>
        `markers=label:${i + 1}|${p.lat},${p.lng}`
    )
    .join('&');

  const startMarker = `markers=color:blue|label:S|${startingPosition.lat},${startingPosition.lng}`;

  const path = `path=enc:${encodedPolyline}`;

  return (
    `https://maps.googleapis.com/maps/api/staticmap?` +
    `size=1200x1200` +
    `&scale=2` +
    `&${startMarker}` +
    `&${markers}` +
    `&${path}` +
    `&key=${apiKey}`
  );
}




  const handleDownload = () => {
  setShowDownloadModal(true);
  setDownloadProgress(0);
  setDownloadMessage('Preparing your offline map...');

  let progress = 0;

  const interval = setInterval(async () => {
    progress += 10;
    setDownloadProgress(progress);

    if (progress === 30) setDownloadMessage('Calculating route...');
    if (progress === 60) setDownloadMessage('Rendering map...');
    if (progress === 90) setDownloadMessage('Finalizing download...');

    if (progress >= 100) {
      clearInterval(interval);

      try {
        const polyline = await buildDirectionsRoute();
        const mapUrl = buildStaticMapWithRoute(polyline);

        const a = document.createElement('a');
        a.href = mapUrl;
        a.download = `${title.replace(/\s+/g, '_')}_route_map.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadMessage('✓ Download Complete');
      } catch (err) {
        console.error(err);
        setDownloadMessage('❌ Failed to generate map');
      }

      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadProgress(0);
      }, 1500);
    }
  }, 200);
};


  const getStatusColor = () => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin size={24} />
              Interactive Route Map
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor()}`}
            >
              {status}
            </span>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Real-time route visualization with Google Maps
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-3 flex-wrap">
          <button
            onClick={centerMap}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Navigation size={16} />
            Center Map
          </button>
          <button
            onClick={fitRoute}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Maximize2 size={16} />
            Fit Route
          </button>
          {canDownload && (
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              <Download size={16} />
              Download Offline Map
            </button>
          )}
        </div>

        {/* Map Container */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">
                  Calculating optimal route...
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Using Google Maps Directions API
                </p>
              </div>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-[600px]"
            style={{ background: '#e5e7eb' }}
          />
        </div>

        {/* Info Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="text-purple-600"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6l9-3-3 9-4-4z" />
              </svg>
              <p className="text-xs text-purple-700 font-medium">
                Total Distance
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {totalDistance.toFixed(1)} km
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="text-blue-600"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4l3 2" />
              </svg>
              <p className="text-xs text-blue-700 font-medium">
                Est. Duration
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatDuration(totalDuration)}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="text-green-600"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4M6 10h8" />
              </svg>
              <p className="text-xs text-green-700 font-medium">Stops</p>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {places.length} waypoints
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 pb-6 border-t border-gray-200 pt-6 bg-gray-50">
          <p className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Map Legend
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                S
              </div>
              <span className="text-sm text-gray-700">Starting Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                1
              </div>
              <span className="text-sm text-gray-700">Waypoints (Stops)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-1 bg-purple-600 rounded shadow-sm"></div>
              <span className="text-sm text-gray-700">
                Optimized Driving Route
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg width="14" height="14" fill="currentColor">
                <path d="M7 0a7 7 0 100 14A7 7 0 007 0zm0 1a6 6 0 110 12A6 6 0 017 1z" />
              </svg>
              <span>Powered by Google Maps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Download className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Downloading Route Map
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{downloadMessage}</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">{downloadProgress}%</p>
            {downloadProgress === 100 && (
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}