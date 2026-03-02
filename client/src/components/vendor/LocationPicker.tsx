import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface LocationPickerProps {
    initialAddress?: string;
    onAddressSelect: (address: string) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
};

const defaultCenter = {
    lat: 11.2588, // Defaults to Calicut as seen in other map components
    lng: 75.7804,
};

const LocationPicker: React.FC<LocationPickerProps> = ({ initialAddress, onAddressSelect }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(defaultCenter);
    const [address, setAddress] = useState(initialAddress || '');
    const [isLocating, setIsLocating] = useState(false);

    const geocodePosition = useCallback((pos: google.maps.LatLngLiteral) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                const formattedAddress = results[0].formatted_address;
                setAddress(formattedAddress);
                onAddressSelect(formattedAddress);
            }
        });
    }, [onAddressSelect]);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setMarkerPosition(pos);
            geocodePosition(pos);
        }
    }, [geocodePosition]);

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPosition(pos);
                    map?.panTo(pos);
                    geocodePosition(pos);
                    setIsLocating(false);
                },
                () => {
                    setIsLocating(false);
                    alert('Error: The Geolocation service failed.');
                }
            );
        } else {
            alert("Error: Your browser doesn't support geolocation.");
        }
    };

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    if (!isLoaded) return <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl"><Loader2 className="animate-spin text-emerald-500" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" />
                    Business Address
                </label>
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                    className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                    {isLocating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                    Use My Location
                </button>
            </div>

            <div className="relative border rounded-xl overflow-hidden shadow-sm">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPosition}
                    zoom={15}
                    onClick={onMapClick}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    <Marker position={markerPosition} />
                </GoogleMap>
            </div>

            <textarea
                value={address}
                onChange={(e) => {
                    setAddress(e.target.value);
                    onAddressSelect(e.target.value);
                }}
                placeholder="Select location on map or type address here..."
                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[80px] bg-gray-50/50"
            />
        </div>
    );
};

export default LocationPicker;
